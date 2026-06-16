package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String profileImage;
    private String role;
    private boolean premium;
    private LocalDateTime createdAt;
}