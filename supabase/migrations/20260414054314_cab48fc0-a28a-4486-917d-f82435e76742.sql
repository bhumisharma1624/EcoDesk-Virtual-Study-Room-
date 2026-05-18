CREATE POLICY "Users can delete own history"
ON public.session_history
FOR DELETE
USING (auth.uid() = user_id);