# Splash Screen Implementation

## Overview
A beautiful animated splash screen has been added to the Target History app with the following features:

## Features
- **Gradient Background**: Sunset gradient using the app's primary colors
- **Animated Logo**: Rotating temple/building icon with bounce-in animation
- **Staggered Text Animation**: Title and subtitle appear with smooth transitions
- **Floating Particles**: History-themed icons that pulse and float around the screen
- **2-Second Duration**: Automatically redirects to the main app after 2 seconds

## Animations Used
- **react-native-animatable**: For smooth, declarative animations
- **react-native-linear-gradient**: For the beautiful gradient background
- **react-native-vector-icons**: For history-themed icons

## Animation Sequence
1. **Logo (200ms delay)**: Bounces in with elastic effect
2. **Particles (800ms+ delay)**: Fade in with staggered timing
3. **Title (600ms delay)**: Slides up from below
4. **Underline (1000ms delay)**: Slides in from left
5. **Subtitle (1200ms delay)**: Fades in
6. **Tagline (1400ms delay)**: Fades in last
7. **Bottom decoration (1600ms delay)**: Fades up with pulsing icon

## History-Themed Elements
- **Main Icon**: `account_balance` (temple/government building)
- **Particle Icons**: 
  - `schedule` (time/history)
  - `public` (world/global history)
  - `account_balance` (ancient buildings)
  - `library_books` (knowledge/learning)
  - `explore` (discovery)
  - `star` (achievements)

## Colors & Theming
- Uses the app's existing color palette from `Colors.ts`
- Sunset gradient (`Colors.gradients.sunset`)
- Semi-transparent white elements for elegance
- Consistent with the app's overall design language

## Integration
- Added to `AppNavigator.tsx` with state management
- Shows on app launch, then navigates to main tab navigator
- Handles StatusBar visibility properly
- Clean component separation for maintainability

## Usage
The splash screen automatically appears when the app launches and redirects to the main app after 2 seconds. No additional configuration needed.