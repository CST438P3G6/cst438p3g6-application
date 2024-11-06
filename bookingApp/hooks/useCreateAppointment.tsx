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


        const { data: service, error: serviceError } = await supabase
            .from('service')
            .select('cost, time_needed')
            .eq('id', serviceId)
            .single();

        if (serviceError) return handleError(serviceError.message);

        const { cost, time_needed } = service as unknown as { cost: number; time_needed: string };

        const durationMs = parseInterval(time_needed);
        const startDate = new Date(startTime);
        if (isNaN(startDate.getTime())) return handleError('Invalid start time format');

        const endTime = new Date(startDate.getTime() + durationMs).toISOString();


        const { data, error } = await supabase
            .from('appointment')
            .insert({ service_id: serviceId, start_time: startTime, end_time: endTime, status: 'pending', user_id: userId, cost })
            .select()
            .single();

        console.log('Insert response:', { data, error });

        if (error) return handleError(error.message);


        setLoading(false);
        return { data: data as unknown as Appointment, error: null };
    };

    const handleError = (message: string) => {
        setError(message);
        setLoading(false);
        return { data: null, error: message };
    };

    return { createAppointment, loading, error };
}

// Helper function to parse 'HH:MM:SS' format into milliseconds
function parseInterval(interval: string): number {
    const [hours = '0', minutes, seconds] = interval.split(':').map(Number);
    // @ts-ignore
    if ([hours, minutes, seconds].some(isNaN)) throw new Error("Invalid interval format. Expected 'HH:MM:SS'");

    return ((+hours * 60 + +minutes) * 60 + +seconds) * 1000;
}