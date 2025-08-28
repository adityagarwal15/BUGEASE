import React, { useState, useRef } from "react";
import { mockRideHistory } from "@/data/buggies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Calendar,
  ArrowUpDown,
  Download,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

const RideHistory = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredRides = mockRideHistory.filter(ride => {
    // Filter by status
    if (filter !== "all" && ride.status !== filter) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !`${ride.pickupLocation.name} ${ride.dropoffLocation.name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };

  const handleExport = async () => {
    if (!tableRef.current || filteredRides.length === 0) {
      toast({
        title: "Export failed",
        description: "No ride history data to export.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Preparing PDF",
      description: "Please wait while we generate your ride history PDF...",
    });

    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFillColor(245, 245, 245);
      pdf.rect(
        0,
        0,
        pdf.internal.pageSize.width,
        pdf.internal.pageSize.height,
        "F"
      );

      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Ride History", 105, 15, { align: "center" });

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${new Date().toLocaleString()}`, 105, 22, {
        align: "center",
      });

      pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight);
      pdf.save("ride-history.pdf");

      toast({
        title: "Export successful",
        description: "Your ride history has been exported as a PDF.",
        variant: "default",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Ride History</h1>
            <p className="text-muted-foreground">
              View and track all your past buggy rides
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExport}
              disabled={filteredRides.length === 0}
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex gap-2 grow">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rides</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Rides Table */}
            <div ref={tableRef} className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Ride Details</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRides.length > 0 ? (
                    filteredRides.map(ride => (
                      <TableRow key={ride.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{formatDate(ride.requestTime)}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(ride.requestTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-primary" />
                              <span>{ride.pickupLocation.name}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1 text-accent" />
                              <span>{ride.dropoffLocation.name}</span>
                            </div>
                            {ride.buggyName && (
                              <span className="text-xs text-muted-foreground mt-1">
                                Buggy: {ride.buggyName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={cn(
                              "font-normal",
                              getStatusColor(ride.status)
                            )}
                          >
                            {ride.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="text-lg font-medium mb-1">
                            No ride history
                          </p>
                          <p className="text-muted-foreground text-sm mb-4">
                            You haven't taken any rides yet
                          </p>
                          <Button asChild variant="outline">
                            <Link to="/book">Book your first ride</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RideHistory;
