import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const {isLoading, handleGoogleSignIn } = useGoogleAuth();

 

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          {/* Onboarding Image */}
          <View className="mx-auto">
            <Image
              source={require("../../assets/images/auth1.png")}
              className="size-96"
              resizeMode="contain"
            />
          </View>

          {/* Google Button */}
          <View className="flex-col gap-2 mt-4">
            <TouchableOpacity
              className="flex items-center bg-white border border-gray-300 rounded-full py-2 px-6 w-full"
              onPress={() =>handleGoogleSignIn("oauth_google")}
              disabled={isLoading} // Disable while loading
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" className="p-2"/>
                ) : (
                  <Image
                    source={require("../../assets/images/google.png")}
                    className="size-10 mr-3"
                    resizeMode="contain"
                  />
                )}

                <Text className="text-black font-medium text-base ml-2">
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
