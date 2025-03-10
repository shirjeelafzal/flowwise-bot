import { useState } from "react";
import Header from "../components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, Calendar as CalendarIcon, Clock, User } from "lucide-react";

// Types for appointments
interface Appointment {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  status: 'confirmed' | 'handed_off' | 'completed';
  currentAgent: 'alley' | 'benny' | 'calendar' | 'client';
}

export default function Appointments() {
  // Mock query for now - will be replaced with actual API endpoint
  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments'],
    queryFn: () => [
      {
        id: 1,
        customerName: "Amy Trill",
        phone: "777-888-9999",
        email: "domuaidev2025@gmail.com",
        date: "3/26/2025",
        time: "2:30:00 PM",
        status: 'confirmed',
        currentAgent: 'benny'
      },
      {
        id: 2,
        customerName: "Layla Lennon",
        phone: "1-777-888-9999",
        email: "craiglist222222@gmail.com",
        date: "3/26/2025",
        time: "4:30:00 PM",
        status: 'confirmed',
        currentAgent: 'benny'
      }
    ]
  });

  return (
    <div className="p-6 space-y-6">
      <Header title="Appointments" />

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-6">
            <p>Loading appointments...</p>
          </Card>
        ) : appointments?.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No appointments scheduled</p>
          </Card>
        ) : (
          appointments?.map((appointment) => (
            <Card key={appointment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  {/* Customer Name and Status */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{appointment.customerName}</h3>
                    <Badge variant="outline" className="bg-green-50">
                      {appointment.status}
                    </Badge>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{appointment.email}</span>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {/* Current Agent */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Current Agent: {appointment.currentAgent}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Handing off appointment to Benny:', appointment.id);
                  }}
                >
                  Hand off to Benny
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}