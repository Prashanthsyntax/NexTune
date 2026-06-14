package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean premium;
    private boolean active;
    private boolean emailVerified;
    private String profileImage;
    private LocalDateTime createdAt;
}