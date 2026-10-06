// Känner av om telefonen ligger med skärmen nedåt, med två sensorer från expo-sensors:
// - Accelerometern: åt vilket håll tyngdkraften drar (z-axeln)
// - Ljussensorn (bara Android): hur ljust det är vid skärmen

import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Accelerometer, LightSensor } from "expo-sensors";

// Hur mycket av tyngdkraften (i g) som måste dra "genom" skärmen för att räknas som nedåt
const FACE_DOWN_Z = 0.8;
// Under så här många lux räknas det som mörkt (täckt sensor)
const DARK_LUX = 10;

export function useFaceDown() {
  // z: accelerometerns z-värde i g (ungefär +1 eller −1 när telefonen ligger plant)
  const [z, setZ] = useState(0);
  // lux: ljusnivån, eller null om telefonen saknar ljussensor
  const [lux, setLux] = useState<number | null>(null);

  // Accelerometern: starta när komponenten visas, stäng av när den försvinner
  useEffect(() => {
    Accelerometer.setUpdateInterval(200);
    const subscription = Accelerometer.addListener((data) => setZ(data.z));
    return () => subscription.remove();
  }, []);

  // Ljussensorn: bara om den finns på telefonen
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    LightSensor.isAvailableAsync().then((available) => {
      if (available) {
        subscription = LightSensor.addListener((data) => setLux(data.illuminance));
      }
    });

    return () => subscription?.remove();
  }, []);

  // Skärmen pekar nedåt. Android och iOS räknar z-axeln åt olika håll.
  const isScreenDown = Platform.OS === "ios" ? z > FACE_DOWN_Z : z < -FACE_DOWN_Z;

  // Mörkt vid skärmen (sensorn täckt)?
  // Android: ljussensorn MÅSTE ha mätt mörker, annars går det att fuska.
  // iOS har ingen ljussensor, där får accelerometern räcka.
  const isDark = Platform.OS === "ios" ? true : lux !== null && lux < DARK_LUX;

  // Nedlagd = skärmen pekar nedåt OCH det är mörkt vid skärmen
  const isFaceDown = isScreenDown && isDark;

  return { isFaceDown, z, lux };
}
