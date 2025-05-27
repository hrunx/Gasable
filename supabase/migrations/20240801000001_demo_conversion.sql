-- Create a function to track when a demo user converts to a real user
CREATE OR REPLACE FUNCTION public.track_demo_user_conversion(
  p_demo_email TEXT,
  p_user_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Update the demo user record with the conversion information
  UPDATE demo_users
  SET 
    conversion_status = 'converted',
    converted_user_id = p_user_id,
    last_accessed_at = NOW(),
    metadata = demo_users.metadata || jsonb_build_object('conversion_time', NOW())
  WHERE 
    email = p_demo_email
    AND conversion_status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to automatically track conversions when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_conversion() 
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user's email exists in demo_users table
  PERFORM track_demo_user_conversion(NEW.email, NEW.id)
  FROM demo_users
  WHERE email = NEW.email AND conversion_status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table to track conversions
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_conversion(); 