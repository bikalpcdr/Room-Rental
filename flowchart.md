# Room Rental Portal - System Flowchart

## 1. User Registration & Authentication Flow

```mermaid
flowchart TD
    A[User visits website] --> B{User registered?}
    B -->|No| C[Register Form]
    B -->|Yes| D[Login Form]
    
    C --> E[Fill registration details]
    E --> F[Select role: Renter/Owner/Admin]
    F --> G[Submit registration]
    G --> H[Backend validation]
    H --> I{Valid data?}
    I -->|No| J[Show error message]
    I -->|Yes| K[Create user account]
    K --> L[Redirect to login]
    
    D --> M[Enter credentials]
    M --> N[Backend authentication]
    N --> O{Valid credentials?}
    O -->|No| P[Show error message]
    O -->|Yes| Q[Generate JWT token]
    Q --> R[Redirect to dashboard based on role]
    
    J --> D
    P --> D
```

## 2. Property Management Flow (Owner)

```mermaid
flowchart TD
    A[Owner Dashboard] --> B[View My Properties]
    B --> C{Property exists?}
    
    C -->|No| D[Create New Property]
    C -->|Yes| E[Property List]
    
    D --> F[Property Form]
    F --> G[Fill property details]
    G --> H[Upload property images]
    H --> I[Select amenities]
    I --> J[Set price & availability]
    J --> K[Submit property]
    K --> L[Backend validation]
    L --> M{Valid?}
    M -->|No| N[Show error]
    M -->|Yes| O[Save property]
    O --> P[Redirect to property list]
    
    E --> Q[Property Table]
    Q --> R{Action?}
    R -->|Edit| S[Edit Property]
    R -->|View| T[View Property Details]
    R -->|Delete| U[Delete Property]
    
    S --> F
    T --> V[Property Detail Page]
    U --> W[Confirm deletion]
    W --> X[Remove from database]
    X --> P
    
    N --> F
```

## 3. Property Search & Booking Flow (Renter)

```mermaid
flowchart TD
    A[Renter Dashboard] --> B[Property Search]
    B --> C[Apply filters]
    C --> D[Search properties]
    D --> E[Property List]
    E --> F[Select Property]
    F --> G[View Property Details]
    G --> H{Property available?}
    
    H -->|No| I[Show unavailable message]
    H -->|Yes| J[Book Property]
    
    J --> K[Booking Form]
    K --> L[Select dates]
    L --> M[Enter details]
    M --> N[Calculate total amount]
    N --> O[Initiate Payment]
    
    O --> P[Generate booking]
    P --> Q[Create payment request]
    Q --> R[Redirect to eSewa]
    
    R --> S{eSewa Payment}
    S -->|Success| T[Payment Success Page]
    S -->|Failure| U[Payment Failure Page]
    
    T --> V[Save transaction]
    V --> W[Update booking status]
    W --> X[Update property availability]
    X --> Y[Show success message]
    Y --> Z[Redirect to booking history]
    
    U --> AA[Show failure message]
    AA --> BB[Redirect to property search]
    
    I --> B
```

## 4. Payment Processing Flow

```mermaid
flowchart TD
    A[Booking Initiated] --> B[Generate Order Number]
    B --> C[Create Payment Request]
    C --> D[Prepare eSewa Data]
    D --> E[Base64 Encode]
    E --> F[Redirect to eSewa]
    
    F --> G[User completes payment]
    G --> H{eSewa Response}
    
    H -->|Success| I[Callback to Success URL]
    H -->|Failure| J[Callback to Failure URL]
    
    I --> K[Extract payment data]
    K --> L[Decode base64 data]
    L --> M[Parse transaction details]
    M --> N[Save Payment Transaction]
    N --> O[Update Booking Status]
    O --> P[Update Property Availability]
    P --> Q[Show Success Page]
    
    J --> R[Extract payment data]
    R --> S[Decode base64 data]
    S --> T[Parse transaction details]
    T --> U[Save Payment Transaction]
    U --> V[Update Booking Status]
    V --> W[Show Failure Page]
    
    Q --> X[Redirect to Dashboard]
    W --> Y[Redirect to Property Search]
```

## 5. Admin Management Flow

```mermaid
flowchart TD
    A[Admin Dashboard] --> B[Manage Users]
    A --> C[Manage Properties]
    A --> D[View All Bookings]
    A --> E[Payment Transactions]
    
    B --> F[User List]
    F --> G{Action?}
    G -->|Edit| H[Edit User]
    G -->|Delete| I[Delete User]
    G -->|View| J[View User Details]
    
    C --> K[Property List]
    K --> L{Action?}
    L -->|Approve| M[Approve Property]
    L -->|Reject| N[Reject Property]
    L -->|Delete| O[Delete Property]
    
    D --> P[Booking List]
    P --> Q[View Booking Details]
    Q --> R[Update Booking Status]
    
    E --> S[Transaction List]
    S --> T[View Transaction Details]
    T --> U[Generate Reports]
    
    H --> V[Update User]
    I --> W[Remove User]
    M --> X[Set Property Active]
    N --> Y[Set Property Inactive]
    O --> Z[Remove Property]
    
    V --> F
    W --> F
    X --> K
    Y --> K
    Z --> K
    R --> P
    U --> S
```

## 6. Overall System Architecture Flow

```mermaid
flowchart TD
    A[Frontend React App] --> B[API Gateway]
    B --> C[Spring Boot Backend]
    
    C --> D[Authentication Service]
    C --> E[Property Service]
    C --> F[Booking Service]
    C --> G[Payment Service]
    C --> H[User Service]
    
    D --> I[JWT Token Management]
    E --> J[Property CRUD Operations]
    F --> K[Booking Management]
    G --> L[eSewa Integration]
    H --> M[User Management]
    
    J --> N[PostgreSQL Database]
    K --> N
    L --> O[eSewa Payment Gateway]
    M --> N
    
    P[File Storage] --> Q[Property Images]
    Q --> E
    
    R[Email Service] --> S[Notifications]
    S --> F
    S --> G
```

## 7. Error Handling Flow

```mermaid
flowchart TD
    A[User Action] --> B[Frontend Validation]
    B --> C{Valid?}
    C -->|No| D[Show Frontend Error]
    C -->|Yes| E[API Request]
    
    E --> F[Backend Validation]
    F --> G{Valid?}
    G -->|No| H[Return Error Response]
    G -->|Yes| I[Process Request]
    
    I --> J{Success?}
    J -->|No| K[Handle Exception]
    J -->|Yes| L[Return Success Response]
    
    K --> M[Log Error]
    M --> N[Return Error Response]
    
    D --> O[User Corrects Input]
    H --> P[Show Error Message]
    N --> P
    
    O --> A
    P --> A
    L --> Q[Update UI]
```

## 8. Data Flow Diagram

```mermaid
flowchart TD
    A[User Input] --> B[Frontend Components]
    B --> C[API Layer]
    C --> D[Service Layer]
    D --> E[Repository Layer]
    E --> F[Database]
    
    G[External Payment Gateway] --> H[Payment Service]
    H --> D
    
    I[File Upload] --> J[File Storage]
    J --> K[Property Service]
    K --> D
    
    L[Email Service] --> M[Notification System]
    M --> N[User Communication]
    
    O[Authentication] --> P[JWT Token]
    P --> Q[Security Layer]
    Q --> C
    
    R[Logging] --> S[System Monitoring]
    S --> T[Error Tracking]
```

This flowchart documentation provides a comprehensive overview of the Room Rental Portal system's various flows, from user registration to payment processing, and includes error handling and system architecture diagrams. 