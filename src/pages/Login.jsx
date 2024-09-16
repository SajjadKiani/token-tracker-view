import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import Header from '../components/Header';
import { SupabaseAuthUI } from '@/integrations/supabase';

const Login = () => {

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        <SupabaseAuthUI />
      </div>
    </div>
  );
};

export default Login;
