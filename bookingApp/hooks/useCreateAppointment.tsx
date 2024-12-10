import { useState } from 'react';
import { supabase } from '@/utils/supabase';

type Appointment = {
    id?: number;
    service_id: number;
    start_time: string;
    end_time: string;
    status?: string;
    user_id: string;
    cost: number;
};

export function useCreateAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAppointment = async (
        serviceId: number,
        userId: string,
        startTime: string
    ): Promise<{ data: Appointment | null; error: string | null }> => {
        setLoading(true);
        setError(null);

        // Fetch service details
        const { data: service, error: serviceError } = await supabase
            .from('service')
            .select('cost, time_needed')
            .eq('id', serviceId)
            .single();

        if (serviceError) return handleError(serviceError.message);

        const { cost, time_needed } = service as { cost: number; time_needed: string };

        // Parse duration
        const durationMs = parseInterval(time_needed);

        // Parse start time as UTC
        const startDate = new Date(startTime + 'Z');
        if (isNaN(startDate.getTime())) return handleError('Invalid start time format');

        // Calculate end time
        const endTime = new Date(startDate.getTime() + durationMs).toISOString();

        // Insert appointment
        const { data, error } = await supabase
            .from('appointment')
            .insert({
                service_id: serviceId,
                start_time: startDate.toISOString(),
                end_time: endTime,
                status: 'pending',
                user_id: userId,
                cost,
            })
            .select()
            .single();

        if (error) return handleError(error.message);

        setLoading(false);
        return { data: data as Appointment, error: null };
    };

    const handleError = (message: string) => {
        setError(message);
        setLoading(false);
        return { data: null, error: message };
    };

    return { createAppointment, loading, error };
}

// Helper function to parse 'HH:MM:SS' or 'HH:MM' format into milliseconds
function parseInterval(interval: string): number {
    const parts = interval.split(':').map(Number);
    if (parts.some(isNaN)) throw new Error("Invalid interval format. Expected 'HH:MM' or 'HH:MM:SS'");
    let [hours = 0, minutes = 0, seconds = 0] = parts;
    if (parts.length === 2) {
        [hours, minutes] = parts;
        seconds = 0;
    }
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}
