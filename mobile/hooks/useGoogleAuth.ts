import { useState } from "react"
import { useSSO } from "@clerk/clerk-expo";
import { Alert } from "react-native";

export const useGoogleAuth = () => {

    const [isLoading, setIsLoading] = useState(false)
    const {startSSOFlow} = useSSO();

     const handleGoogleSignIn = async (strategy: "oauth_google") => {
        setIsLoading(true);
        try {
          // Simulate async operation
          const { createdSessionId, setActive } = await startSSOFlow({ strategy })

            if (createdSessionId && setActive){
            await setActive({session: createdSessionId})
            }

        } catch (error) {
          console.error("Error in sGoogle auth",error);
          Alert.alert("Error", "Failed to sign in with Google, Please try again letter")
        } finally {
          setIsLoading(false);
        }
      };

    return {isLoading, handleGoogleSignIn}
}