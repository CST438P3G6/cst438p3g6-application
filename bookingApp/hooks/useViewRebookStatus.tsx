import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export function useViewRebookStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const checkServiceStatus = async (appointmentId: string) => {
        setLoading(true);
        setError(null);
        setStatusMessage(null);

        try {
            // Fetch the appointment details
            const { data: appointment, error: appointmentError } = await supabase
                .from('appointment')
                .select('service_id')
                .eq('id', appointmentId)
                .single();

            if (appointmentError) throw new Error(appointmentError.message);

            const serviceId = appointment.service_id;

            // Fetch the service details
            const { data: service, error: serviceError } = await supabase
                .from('service')
                .select('is_active, business_id')
                .eq('id', serviceId)
                .single();

            if (serviceError) throw new Error(serviceError.message);

            const { is_active: isServiceActive, business_id: businessId } = service;

            // Fetch the business details
            const { data: business, error: businessError } = await supabase
                .from('business')
                .select('is_active')
                .eq('id', businessId)
                .single();

            if (businessError) throw new Error(businessError.message);


            const { is_active: isBusinessActive } = business;


            if (!isServiceActive && isBusinessActive) {
                setStatusMessage('service is no longer offered');
            } else if (isServiceActive && isBusinessActive) {
                setStatusMessage('service available');
            } else if (!isServiceActive && !isBusinessActive) {
                setStatusMessage('business temporarily closed');
            } else if (isServiceActive && !isBusinessActive) {
                setStatusMessage('business temporarily closed');
            }

            setLoading(false);
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    return { checkServiceStatus, statusMessage, loading, error };
}