
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail, Twitter, User } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Lead Developer',
    bio: 'Alex is an experienced full-stack developer with expertise in React, Node.js, and real-time systems. He leads the technical development of the Campus Buggy platform.',
    imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    social: {
      twitter: 'https://twitter.com/alexmorgan',
      linkedin: 'https://linkedin.com/in/alexmorgan',
      github: 'https://github.com/alexmorgan',
      email: 'alex@campusbuggy.com'
    }
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'UX/UI Designer',
    bio: 'Sarah is a talented designer who creates beautiful, intuitive interfaces. She combines her background in cognitive psychology with design expertise to make Campus Buggy a delightful experience.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    social: {
      twitter: 'https://twitter.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      github: 'https://github.com/sarahchen',
      email: 'sarah@campusbuggy.com'
    }
  }
];

const Team = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#1a1a2e] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a]">
            Meet Our Team
          </h1>
          <p className="text-lg text-white/70">
            The brilliant minds behind Campus Buggy. Our diverse team combines technical expertise, design excellence, and a passion for revolutionizing campus transportation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="glass-panel rounded-xl overflow-hidden border border-white/10 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(127,90,240,0.3)] hover:-translate-y-1"
            >
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#252542]">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent"></div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-[#00d1ff] font-medium mb-4">{member.role}</p>
                <p className="text-white/70 mb-6">
                  {member.bio}
                </p>
                <div className="flex space-x-4">
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#1DA1F2] transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#0077B5] transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a 
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.email && (
                    <a 
                      href={`mailto:${member.social.email}`}
                      className="text-white/60 hover:text-[#ff5c8a] transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <User className="h-5 w-5 text-[#7f5af0] mr-2" />
            <span className="text-white/70">Want to join our team? <a href="/contact" className="text-[#00d1ff] hover:underline">Contact us</a></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
