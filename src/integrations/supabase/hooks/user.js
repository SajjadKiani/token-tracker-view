import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### user

| name         | type                     | format                    | required |
|--------------|--------------------------|---------------------------|----------|
| id           | integer                  | bigint                    | true     |
| created_at   | string                   | timestamp with time zone  | true     |
| email        | string                   | character varying         | true     |
| devices      | array                    | json[]                    | false    |
| session      | string                   | text                      | false    |
| subscription | string                   | text                      | false    |

Note: 
- 'id' is the Primary Key.
- 'created_at' has a default value of now().
- There are no explicit foreign key relationships defined in the provided schema.
*/

export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('user').select('*')),
});

export const useUser = (id) => useQuery({
    queryKey: ['users', id],
    queryFn: () => fromSupabase(supabase.from('user').select('*').eq('id', id).single()),
    enabled: !!id,
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('user').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user').update(updateData).eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['users', variables.id]);
            queryClient.invalidateQueries('users');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};