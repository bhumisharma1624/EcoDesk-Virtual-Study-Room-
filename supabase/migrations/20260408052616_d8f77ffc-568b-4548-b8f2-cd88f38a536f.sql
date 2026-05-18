-- Create room_messages table for in-room chat
CREATE TABLE public.room_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  user_id UUID NOT NULL,
  username TEXT NOT NULL DEFAULT 'Anonymous',
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read room messages"
ON public.room_messages FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can send messages"
ON public.room_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON public.room_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;

-- Seed default themed rooms
INSERT INTO public.rooms (name, description, theme, max_participants) VALUES
  ('Lo-fi Library', 'A quiet library with lo-fi beats. Perfect for deep reading and writing.', 'library', 50),
  ('Jazz Café', 'Warm café vibes with smooth jazz. Great for creative work.', 'cafe', 50),
  ('Rainy Day Room', 'The sound of rain on windows. Ideal for focused coding or math.', 'rain', 50),
  ('Deep Focus Lab', 'Minimal distractions. Pure concentration zone with ambient noise.', 'lab', 50),
  ('Instrumental Haven', 'Classical and instrumental music for deep study sessions.', 'library', 50),
  ('Night Owl Den', 'For late-night studiers. Dark and cozy with gentle ambient sounds.', 'cafe', 50);
