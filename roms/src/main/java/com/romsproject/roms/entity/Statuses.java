package com.romsproject.roms.entity;

public class Statuses {

    public enum TableStatus {
        AVAILABLE,
        RESERVED,
        OCCUPIED
    }

    public enum ReservationStatus {
        ACTIVE,
        CANCELLED,
        COMPLETED
    }

    public enum OrderStatus {
        RECEIVED,
        COOKING,
        READY,
        COMPLETED
    }

    public enum OtpPurpose {
        SIGNUP,
        RESET_PASSWORD
    }
}