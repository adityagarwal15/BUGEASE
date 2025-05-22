import os
import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from dotenv import load_dotenv
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Load environment variables from .env file
load_dotenv()

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['message'],
        properties={
            'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message to send to the chatbot')
        }
    ),
    responses={
        200: openapi.Response(
            description="Success",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'reply': openapi.Schema(type=openapi.TYPE_STRING, description='Response from Gemini AI')
                }
            )
        ),
        400: 'Bad Request - Message is required',
        500: 'Server Error - API key not configured or error from Gemini API'
    },
    operation_description="Send a message to the Gemini AI chatbot and get a response"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_view(request):
    """
    API endpoint to interact with Google Gemini API.
    Accepts a POST request with a 'message' field and returns Gemini's response.
    """
    message = request.data.get('message', '')
    
    if not message:
        return Response(
            {"error": "Message field is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Get API key from environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            return Response(
                {"error": "API key not configured"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # API endpoint URL with API key
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
        
        # Prepare request body for Gemini API
        request_data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": message
                        }
                    ]
                }
            ]
        }
        
        # Make request to Gemini API
        response = requests.post(
            url=url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(request_data)
        )
        
        # Check if the API call was successful
        if response.status_code == 200:
            response_data = response.json()
            
            # Extract the text response from Gemini API
            if (response_data.get('candidates') and 
                response_data['candidates'][0].get('content') and 
                response_data['candidates'][0]['content'].get('parts')):
                
                reply_text = response_data['candidates'][0]['content']['parts'][0].get('text', '')
                return Response({"reply": reply_text})
            else:
                return Response(
                    {"error": "Unexpected response format from Gemini API"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {"error": f"Gemini API error: {response.text}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
