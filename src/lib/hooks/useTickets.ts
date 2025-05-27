import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoTicketSummary, demoTicketMessages } from '../demo-data';
import { useAuth } from '../auth';

export interface TicketSummary {
  id: string;
  ticket_number: string;
  company_id: string;
  customer_id: string | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assignee_id: string | null;
  response_time: number | null;
  resolution_time: number | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  assignee_name: string | null;
  company_name: string | null;
  message_count: number | null;
  last_message_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  sender_type: string;
  message: string;
  attachments: string[] | null;
  created_at: string;
}

export function useTickets(options: {
  status?: string;
  priority?: string;
  limit?: number;
} = {}) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, priority, limit } = options;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          let ticketsData = [...demoTicketSummary];
          
          // Apply status filter if provided
          if (status) {
            ticketsData = ticketsData.filter(t => t.status === status);
          }
          
          // Apply priority filter if provided
          if (priority) {
            ticketsData = ticketsData.filter(t => t.priority === priority);
          }
          
          // Apply limit if provided
          if (limit && limit > 0) {
            ticketsData = ticketsData.slice(0, limit);
          }
          
          setTickets(ticketsData);
          setLoading(false);
          return;
        }

        if (!user) {
          setTickets([]);
          setLoading(false);
          return;
        }

        // Get company ID from user metadata or users table
        let companyId = user.user_metadata?.company_id;
        
        if (!companyId) {
          // Try to get company ID from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('company_id')
            .eq('id', user.id)
            .single();

          if (userError) {
            throw new Error(`Error fetching user data: ${userError.message}`);
          }

          companyId = userData?.company_id;
          
          if (!companyId) {
            setTickets([]);
            setLoading(false);
            setError('No company associated with this user');
            return;
          }
        }

        // Build the query
        let query = supabase
          .from('ticket_summary')
          .select('*')
          .eq('company_id', companyId);
        
        // Add status filter if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Add priority filter if provided
        if (priority) {
          query = query.eq('priority', priority);
        }
        
        // Add limit if provided
        if (limit && limit > 0) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data: ticketsData, error: ticketsError } = await query;

        if (ticketsError) {
          throw new Error(`Error fetching tickets: ${ticketsError.message}`);
        }

        setTickets(ticketsData || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useTickets:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, status, priority, limit]);

  return { tickets, loading, error };
}

export function useTicketMessages(ticketId: string | null) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!ticketId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        if (isDemoMode()) {
          // Use demo data
          const messagesData = demoTicketMessages.filter(m => m.ticket_id === ticketId);
          setMessages(messagesData);
          setLoading(false);
          return;
        }

        // Fetch messages from Supabase
        const { data: messagesData, error: messagesError } = await supabase
          .from('ticket_messages')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          throw new Error(`Error fetching ticket messages: ${messagesError.message}`);
        }

        setMessages(messagesData || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useTicketMessages:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [ticketId]);

  return { messages, loading, error };
}