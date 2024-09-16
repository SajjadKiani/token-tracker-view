import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import Header from '../components/Header';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (cooldown > 0) {
      toast({
        title: "Signup Cooldown",
        description: `Please wait ${cooldown} seconds before trying again.`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.status === 429) {
          setCooldown(60);
          throw new Error("Email rate limit exceeded. Please try again later.");
        }
        throw error;
      }

      setEmailSent(true);
      toast({
        title: "Signup Successful",
        description: "Please check your email to confirm your account.",
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationEmail = async () => {
    if (cooldown > 0) {
      toast({
        title: "Resend Cooldown",
        description: `Please wait ${cooldown} seconds before trying again.`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Confirmation Email Resent",
        description: "Please check your email for the confirmation link.",
      });
      setCooldown(60);
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {!emailSent ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || cooldown > 0}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || cooldown > 0}
            />
            <Button type="submit" className="w-full" disabled={isLoading || cooldown > 0}>
              {isLoading ? 'Signing up...' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Sign Up'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p>A confirmation email has been sent to {email}. Please check your inbox and click the confirmation link to complete your registration.</p>
            <Button onClick={resendConfirmationEmail} disabled={isLoading || cooldown > 0} className="w-full">
              {isLoading ? 'Resending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Confirmation Email'}
            </Button>
          </div>
        )}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Button variant="link" onClick={() => navigate('/login')}>
            Login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
