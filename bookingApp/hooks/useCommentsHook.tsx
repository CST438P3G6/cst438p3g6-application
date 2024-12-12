import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/utils/supabase';

// Define the Comment type based on your 'comments' table structure
type Comment = {
    id: string;
    business_id: string;
    body: string;
    rating: number;
    user_id: string;
};

type UseCommentsReturn = {
    comments: Comment[] | null;
    loading: boolean;
    addingComment: boolean;
    deletingComment: boolean;
    error: string | null;
    fetchComments: () => Promise<void>;
    addComment: (body: string, rating: number) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    updateComment: (commentId: string, body: string, rating: number) => Promise<void>;
};

export  function useComments(businessId: string, userId: string): UseCommentsReturn {
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [addingComment, setAddingComment] = useState(false);
    const [deletingComment, setDeletingComment] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('business_id', businessId);

        if (error) {
            setError(error.message);
            setComments(null);
        } else {
            setComments(data);
        }
        setLoading(false);
    }, [businessId]);

    const addComment = useCallback(async (body: string, rating: number) => {
        if (!body.trim()) return;

        setAddingComment(true);
        setError(null);

        const { data, error } = await supabase
            .from('comments')
            .insert([{ business_id: businessId, body, rating, user_id: userId }]);

        if (error) {
            setError(error.message);
        } else if (data) {
            setComments((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        }
        setAddingComment(false);
    }, [businessId, userId]);

    const deleteComment = useCallback(async (commentId: string) => {
        setDeletingComment(true);
        setError(null);

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            setError(error.message);
        } else {
            setComments((prev) => (prev ? prev.filter((comment) => comment.id !== commentId) : null));
        }
        setDeletingComment(false);
    }, []);

    const updateComment = useCallback(async (commentId: string, body: string, rating: number) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('comments')
            .update({ body, rating })
            .eq('id', commentId);

        if (error) {
            setError(error.message);
        } else if (data) {
            setComments((prev) => (prev ? prev.map((comment) => (comment.id === commentId ? data[0] : comment)) : null));
        }
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (businessId) {
                fetchComments();
            }
        }, [businessId, fetchComments])
    );

    return { comments, loading, addingComment, deletingComment, error, fetchComments, addComment, deleteComment, updateComment };
}
