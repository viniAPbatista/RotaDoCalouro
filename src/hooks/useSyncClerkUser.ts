import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "../lib/supabase";

export function useSyncClerkUser() {
  const { user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          name: user.username,
          image: user.imageUrl,
        });

      if (error) {
        console.error("Erro ao sincronizar usuário:", error.message);
      }
    };

    syncUser();
  }, [user]);
}
