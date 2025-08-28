import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "ride" | "admin" | "system";
  isRead: boolean;
  priority?: "normal" | "high";
  actionUrl?: string;
};

const Notifications = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Buggy Arriving Soon",
      message:
        "Your buggy will arrive at Main Library in approximately 3 minutes.",
      time: "Just now",
      type: "ride",
      isRead: false,
    },
    {
      id: 2,
      title: "Ride Completed",
      message:
        "Thank you for riding with Campus Buggy. Your journey from Science Building to Student Center has been completed.",
      time: "2 hours ago",
      type: "ride",
      isRead: true,
    },
    {
      id: 3,
      title: "Route Change Notice",
      message:
        "Due to campus construction, buggy routes near Engineering Building will be modified until April 15th.",
      time: "Yesterday",
      type: "system",
      isRead: false,
      priority: "high",
    },
    {
      id: 4,
      title: "Upcoming Maintenance",
      message:
        "Campus Buggy service will be limited on Saturday between 2-4 AM for system maintenance.",
      time: "2 days ago",
      type: "system",
      isRead: true,
    },
    {
      id: 5,
      title: "Message from Administrator",
      message:
        "We've improved our buggy tracking feature. Now you can see real-time ETAs for all buggies on campus!",
      time: "3 days ago",
      type: "admin",
      isRead: true,
    },
    {
      id: 6,
      title: "Ride Cancelled",
      message:
        "Your scheduled ride for tomorrow at 9:30 AM has been cancelled. Tap for details.",
      time: "4 days ago",
      type: "ride",
      isRead: true,
      priority: "high",
      actionUrl: "/history",
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string, priority?: string) => {
    switch (type) {
      case "ride":
        return priority === "high" ? (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        ) : (
          <MapPin className="h-5 w-5 text-secondary" />
        );
      case "admin":
        return <MessageSquare className="h-5 w-5 text-primary" />;
      case "system":
        return priority === "high" ? (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        ) : (
          <Info className="h-5 w-5 text-accent" />
        );
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const rideNotifications = notifications.filter(n => n.type === "ride");
  const systemNotifications = notifications.filter(
    n => n.type === "system" || n.type === "admin"
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated with ride alerts and campus buggy announcements
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card className="glass-panel text-center py-16">
          <CardContent>
            <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">No notifications</h3>
            <p className="text-muted-foreground mt-2">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rides">
              Ride Alerts
              {rideNotifications.filter(n => !n.isRead).length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {rideNotifications.filter(n => !n.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system">
              System & Admin
              {systemNotifications.filter(n => !n.isRead).length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {systemNotifications.filter(n => !n.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {notifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  getIcon={getNotificationIcon}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rides">
            <div className="space-y-4">
              {rideNotifications.length > 0 ? (
                rideNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    getIcon={getNotificationIcon}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No ride notifications</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-4">
              {systemNotifications.length > 0 ? (
                systemNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    getIcon={getNotificationIcon}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No system notifications</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  getIcon: (type: string, priority?: string) => React.ReactNode;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationCard = ({
  notification,
  getIcon,
  onRead,
  onDelete,
}: NotificationCardProps) => {
  const navigate = (url?: string) => {
    if (url) {
      window.location.href = url;
    }
    if (!notification.isRead) {
      onRead(notification.id);
    }
  };

  return (
    <Card
      className={`glass-panel hover:bg-card/80 transition-colors cursor-pointer ${!notification.isRead ? "border-l-4 border-l-primary" : ""}`}
      onClick={() => navigate(notification.actionUrl)}
    >
      <CardContent className="p-4 flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {getIcon(notification.type, notification.priority)}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium mb-1 flex items-center gap-2">
                {notification.title}
                {notification.priority === "high" && (
                  <Badge variant="destructive" className="text-xs font-normal">
                    Important
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
            </div>
            <div className="flex gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-50 hover:opacity-100"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {notification.time}
            </span>
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={e => {
                  e.stopPropagation();
                  onRead(notification.id);
                }}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Notifications;
