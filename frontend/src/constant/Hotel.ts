import { Facility } from "@/enums/Hotel";
import type { FacilityEnum } from "@/enums/Hotel";

export const FacilityOptions: { key: FacilityEnum; label: string }[] = [
    { key: Facility.WIFI, label: "Free Wi-Fi" },
    { key: Facility.AIR_CONDITIONING, label: "Air Conditioning" },
    { key: Facility.TV, label: "Television" },
    { key: Facility.MINI_BAR, label: "Mini Bar" },
    { key: Facility.ROOM_SERVICE, label: "Room Service" },
    { key: Facility.SWIMMING_POOL, label: "Swimming Pool" },
    { key: Facility.GYM, label: "Gym / Fitness Center" },
    { key: Facility.PARKING, label: "Parking" },
    { key: Facility.BREAKFAST_INCLUDED, label: "Breakfast Included" },
    { key: Facility.PET_FRIENDLY, label: "Pet Friendly" },
    { key: Facility.SEA_VIEW, label: "Sea View" },
    { key: Facility.BALCONY, label: "Balcony" },
    { key: Facility.SAFE_BOX, label: "Safe Box" },
    { key: Facility.HAIR_DRYER, label: "Hair Dryer" },
    { key: Facility.COFFEE_MAKER, label: "Coffee Maker" },
];
