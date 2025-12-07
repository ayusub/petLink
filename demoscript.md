# PetLink - Final Demo Script
## EECS 497 Major Design Projects

---

## SECTION 1: INTRODUCTION (1 minute)
**[Show PetLink logo/welcome screen]**

**Speaker:**
"Hello! Welcome to the final demo of PetLink - a mobile application that connects pet owners with trusted caregivers using a Tinder-style matching interface. I'm Ansi, and today I'll be walking you through our fully implemented application.

PetLink solves a real problem that many pet owners face: finding reliable, trustworthy pet care providers in their area. Traditional methods involve browsing long lists of profiles or relying on word-of-mouth recommendations. PetLink streamlines this process by letting users quickly swipe through caregivers, match with ones they like, and start conversations immediately.

Our primary persona is Sarah - a 28-year-old marketing professional who recently adopted a golden retriever named Max. She travels occasionally for work and needs a reliable dog walker for weekday afternoons. Sarah wants the convenience of modern dating apps but for finding pet care. Today, I'll be demonstrating PetLink primarily from her perspective as a pet owner."

---

## SECTION 2: USER ONBOARDING & ACCOUNT CREATION (2 minutes)
**[Show app on device/browser]**

**Speaker:**
"Let's start from the beginning - Sarah opens PetLink for the first time. She's greeted with our welcome screen featuring a clean gradient design and our paw print logo.

**[Click 'Get Started']**

She taps 'Get Started' to create an account. The signup process is straightforward - she needs to provide her full name, email, password, phone number, and zip code. Notice we have a toggle here where users can select whether they're a 'Pet Owner' or 'Caregiver' - Sarah selects Pet Owner since she's looking for care for Max.

**[Fill in form with sample data]**
- Full Name: Sarah Martinez
- Email: sarah.martinez@email.com  
- Password: ••••••••
- Phone: (734) 555-0123
- Zip Code: 48104

**[Click Create Account]**

One of the key technical implementations here is our real-time error handling. Watch what happens if I try to create an account with an email that already exists...

**[Try duplicate email]**

You can see an error message appears directly on the screen - not just a popup that might be missed. This error box has a red background, bold text, and an X emoji for visibility. It automatically clears when the user starts typing again. This works across web and mobile platforms because we implemented a dual error system using both React Native's Alert API and visible on-screen error components.

**[Use new email and complete signup]**

After successful signup, Sarah is automatically logged in and taken directly to the dashboard - no need to manually navigate to login. This was a UX decision we made after testing showed users expected immediate access after account creation.

Behind the scenes, this signup process involves several technical steps:
1. Creating a user in Supabase Authentication
2. Automatically creating a profile record in our PostgreSQL database
3. Implementing Row Level Security policies to ensure data privacy
4. Loading the user's profile and navigating to the dashboard

We had to solve a significant challenge here with RLS policies - initially, profile creation was failing because our policies were blocking inserts during signup. We resolved this by carefully configuring the policies to allow profile creation while still maintaining security."

---

## SECTION 3: BROWSING CAREGIVERS - CORE FEATURE (3 minutes)
**[Show dashboard with swiper]**

**Speaker:**
"Now Sarah is on the main dashboard - this is the heart of PetLink. She sees a card-style interface displaying caregiver profiles one at a time. Let's walk through what information is presented.

**[Point to current card]**

Each caregiver card shows:
- The caregiver's name - here we have Emily Rodriguez
- A verified badge if they've been verified
- Their rating out of 5 stars and total number of reviews
- The services they offer - Emily provides Pet Sitting and Grooming
- A bio describing their experience and personality
- Their availability schedule
- Years of experience

**[Show service filter tabs at top]**

One feature Sarah really appreciates is the service filtering system. She can tap these tabs to filter caregivers by the specific service she needs. Let me demonstrate.

**[Tap 'Dog Walking' filter]**

When I select 'Dog Walking', the app immediately filters to show only caregivers who offer dog walking services. Notice the card deck resets to the first card - this was a bug we fixed where the card index wasn't resetting on filter changes, causing users to see blank screens.

**[Tap 'All' to show all caregivers again]**

We currently have 18 diverse caregiver profiles in our database, each with unique bios, service combinations, and availability. These aren't just placeholder data - we carefully crafted each profile to represent realistic caregivers with varied backgrounds.

**[Demonstrate swiping]**

Sarah can interact with profiles in three ways:

1. **Swipe left or tap the X button** - This passes on the caregiver
**[Swipe left on a card]**

2. **Swipe right or tap the heart button** - This creates a match
**[Swipe right on a card]**

Notice the 'MATCH' overlay appears, and we get an alert showing 'Match! 💚 You matched with [name]!'

3. **Read the full profile** - She can take time to read the bio and details

The swiping mechanism uses the react-native-deck-swiper library, but we had to implement custom ref controls to make the buttons work properly. Initially, the heart and X buttons were just decorative - clicking them didn't actually trigger swipes. We solved this by creating swiperRef and connecting the button onPress handlers to swipeLeft() and swipeRight() methods.

**[Continue swiping through a few more profiles]**

From a technical perspective, here's what happens when Sarah swipes right:
1. The match is detected via the onSwipedRight callback
2. A message entry is created with the caregiver's information
3. The message is stored in AsyncStorage for persistence
4. The message appears in the Messages screen
5. An unread indicator is set

We implemented duplicate match prevention - if Sarah accidentally swipes right on the same caregiver twice, it updates the existing message rather than creating duplicates.

Let me demonstrate the end of the deck...

**[Swipe through remaining cards]**

When Sarah reaches the end, she sees an 'All Done!' message. She can then change filters to view caregivers offering different services."

---

## SECTION 4: MESSAGING SYSTEM (2.5 minutes)
**[Navigate to Messages]**

**Speaker:**
"After matching with several caregivers, Sarah wants to reach out. She taps the message icon in the top right corner.

**[Tap Messages icon]**

This is the Messages screen - it shows all of Sarah's matches in a clean list format. Each message card displays:
- An avatar placeholder
- The caregiver's name  
- A preview of the last message
- A timestamp showing how long ago the conversation was updated
- A blue dot indicator for unread messages

**[Point to blue dots]**

Notice these blue dots - they indicate matches Sarah hasn't opened yet. This is persisted using AsyncStorage, so even if she closes the app and comes back, these indicators remain until she opens the conversation.

Let's open a conversation with one of her matches.

**[Tap on a message card - e.g., "Emily Rodriguez"]**

This opens the full chat interface. This is a fully functional, real-time messaging system we implemented from scratch.

**[Point to chat UI elements]**

The chat screen features:
- A header showing the caregiver's name and role
- Message bubbles - purple for Sarah's messages, white for the caregiver's
- Timestamps under each message showing when they were sent
- An input box at the bottom with a Send button
- Automatic scrolling to the latest message

Let me send a message as Sarah.

**[Type and send: "Hi Emily! I saw you specialize in grooming. I have a golden retriever named Max who needs regular grooming. Are you available on Tuesday afternoons?"]**

Watch how the message appears instantly in Sarah's chat view with a purple bubble on the right side, showing it's her message.

**[Message appears]**

Now, let me simulate receiving a response. I'll open another browser window and log in as Emily to respond.

**[Open incognito/another browser, log in as caregiver, navigate to messages]**

From Emily's perspective, she sees the same messages screen, and when she opens Sarah's conversation...

**[Show Emily's view of the conversation]**

She sees Sarah's message on the left in a white bubble since it's incoming for her. Let me send a response.

**[As Emily, type and send: "Hi Sarah! Yes, I'd love to help with Max's grooming! Tuesday afternoons work great for me. I have 10 years of experience with golden retrievers. When would you like to schedule?"]**

**[Switch back to Sarah's browser]**

And look - Sarah's screen automatically updates with Emily's message in real-time, without needing to refresh. This is powered by Supabase Realtime subscriptions.

**[Point to the technical implementation]**

Here's how the real-time messaging works technically:

1. Messages are stored in a PostgreSQL database table with columns for sender_id, receiver_id, content, timestamp, and read status
2. When the chat screen opens, it subscribes to PostgreSQL changes using Supabase Realtime
3. The subscription filters for INSERT events where the receiver_id matches the current user
4. When a new message arrives, it's automatically added to the state and displayed
5. Row Level Security policies ensure users can only see messages they sent or received

We had to solve several challenges here:
- **Authentication security**: RLS policies prevent users from seeing other people's conversations
- **Real-time synchronization**: Using Supabase channels to listen for database changes
- **Message persistence**: All messages are stored in the database and reload when reopening a conversation
- **Read receipts**: Messages are automatically marked as read when the conversation is opened

This was one of the more complex features to implement because it required coordinating database updates, real-time subscriptions, state management, and UI updates all working together seamlessly."

---

## SECTION 5: PROFILE EDITING (2 minutes)
**[Navigate back to Dashboard, then to Profile]**

**Speaker:**
"Now let's look at Sarah's profile management. From the dashboard, she taps the profile icon.

**[Tap Profile icon]**

This shows her basic profile information - her name, email, and verification status. But Sarah wants to add more details about herself and Max. She taps 'Edit Profile'.

**[Tap 'Edit Profile' button]**

This opens our comprehensive profile editing screen. Users can customize multiple aspects of their profile:

**[Scroll through the form]**

**Basic Information Section:**
Sarah can update her full name, add a bio describing herself, update her phone number, and change her zip code. The bio has a 500-character limit to keep profiles concise.

**[Add bio: "Marketing professional and new dog owner. Love hiking and outdoor activities with Max. Looking for reliable caregivers who are patient with energetic puppies!"]**

**Services Offered Section:**
Here's something unique - even though Sarah is a pet owner, she can also offer services. Maybe she's good at grooming and wants to offer that to other pet owners in her area. She can select from:
- Pet Sitting
- Dog Walking  
- Grooming
- Playdates
- Training

**[Select 'Playdates']**

This flexibility allows PetLink users to be both service seekers and providers, creating a true community marketplace.

**My Pets Section:**
This is crucial for pet owners. Sarah can add all her pets with detailed information.

**[Tap '+ Add Pet']**

The add pet form appears. Let's add Max.

**[Fill in form]**
- Pet name: Max
- Species: Dog
- Description: 2-year-old Golden Retriever, very energetic and friendly, loves fetch and swimming

**[Tap 'Save Pet']**

Max now appears in the pets list with a paw emoji, his name, species, and description. If Sarah had multiple pets, she could add them all here. Each pet card has a delete button if she needs to remove one.

**[Show the pet card]**

Behind the scenes, pets are stored in their own database table with a foreign key relationship to the user's profile. We implemented Row Level Security so users can only view and modify their own pets.

**[Scroll to bottom and tap 'Save Changes']**

When Sarah saves her changes:
1. The profile information updates in the profiles table
2. If she selected any services, a caregiver profile is automatically created or updated using an upsert operation
3. All pets are already saved individually, so they persist
4. The app reloads her profile data and returns to the profile view

**[Show updated profile]**

This profile editing system demonstrates several important technical concepts:
- **Database relationships**: Pets table has a foreign key to profiles
- **Conditional creation**: Caregiver profiles only created if services are selected
- **Upsert operations**: Updates existing caregiver profile if it exists, creates new one if not
- **Form validation**: Required fields are checked before submission
- **Optimistic updates**: Pet additions show immediately in the UI

This was a significant feature addition that required careful database design and RLS policy configuration to ensure data security while maintaining flexibility."

---

## SECTION 6: TECHNICAL ARCHITECTURE (2 minutes)
**[Show code or architecture diagram if available]**

**Speaker:**
"Let me talk about the higher-level technical architecture of PetLink, because this project goes far beyond a prototype - it's a fully functional production application.

**Tech Stack:**

**Frontend:**
- React Native with Expo SDK 54 for cross-platform mobile development
- TypeScript for type safety and better development experience
- React Native StyleSheet and expo-linear-gradient for professional UI design
- Custom components split into separate screen files for maintainability

**Backend:**
- Supabase for our entire backend infrastructure
- PostgreSQL database with 6 main tables: profiles, caregiver_profiles, pets, messages, matches, and reviews
- Row Level Security policies on every table ensuring users can only access their own data
- Supabase Realtime for WebSocket-based live messaging
- Supabase Auth for secure user authentication

**State Management:**
- React hooks (useState, useEffect, useRef) for component state
- AsyncStorage for local data persistence (messages cache)
- Context through props for data flow between screens

**Key Libraries:**
- react-native-deck-swiper for the Tinder-style card interface
- @react-native-async-storage/async-storage for local data caching
- @supabase/supabase-js for database and auth integration

**Architecture Pattern:**

We use a screen-based architecture where each major feature is a separate component:
- WelcomeScreen: Landing and auth navigation
- DashboardScreen: Main swiper interface and filtering
- MessagesScreen: Match list view  
- ChatScreen: One-on-one messaging
- EditProfileScreen: Profile editing

The main App.tsx acts as a router, managing screen transitions and shared state.

**Database Schema:**

Our PostgreSQL database is carefully designed with normalized tables:

1. **profiles**: Core user data (name, email, bio, phone, zip_code, user_type, verified)
2. **caregiver_profiles**: Extended data for caregivers (services array, rating, reviews, availability, experience)
3. **pets**: Pet information (owner_id, name, species, description)
4. **messages**: Chat messages (sender_id, receiver_id, content, timestamp, read status)

Each table has comprehensive RLS policies. For example, the messages table has three policies:
- Users can SELECT messages they sent or received
- Users can INSERT messages where they are the sender  
- Users can UPDATE messages where they are the receiver (for marking as read)

**Security Considerations:**

We take security seriously:
- All database operations go through RLS policies - there's no way to bypass them from the client
- Passwords are hashed using Supabase Auth's bcrypt implementation
- API calls require authentication tokens
- SQL injection is prevented by using parameterized queries through Supabase's client library

**Deployment:**

The app is currently deployed as:
- Web version accessible via browser for testing and demos
- Can be built for iOS and Android using Expo's EAS Build service
- Database hosted on Supabase's cloud infrastructure with automatic backups"

---

## SECTION 7: CHALLENGES & SOLUTIONS (2 minutes)
**Speaker:**
"Throughout development, we encountered several significant challenges. Let me discuss the most impactful ones and how we solved them.

**Challenge 1: Orphaned Auth Users**

Early in development, we noticed that users could create accounts but then couldn't log in. The error was cryptic: 'Bad Request' with no explanation.

**The Problem:** 
When users signed up, Supabase successfully created an entry in the auth.users table, but our profile creation in the profiles table was failing due to Row Level Security policies blocking the INSERT operation. This created 'orphaned' users - they existed in authentication but had no profile data.

**The Solution:**
We had to carefully redesign our RLS policies. The key was creating a policy that allows inserts during signup:
```sql
CREATE POLICY 'Allow profile creation during signup'
ON profiles FOR INSERT
WITH CHECK (true);
```

We also created a cleanup script that identifies orphaned users and creates their missing profiles. This taught us the importance of understanding database security policies and how they interact with application logic.

**Challenge 2: Real-time Messaging Wasn't Real-time**

Initially, our messaging system required users to refresh to see new messages - not great for a chat application!

**The Problem:**
We were polling the database on component mount but not subscribing to changes. Messages were stored correctly but not pushed to connected clients.

**The Solution:**
We implemented Supabase Realtime subscriptions:
1. When opening a chat, subscribe to INSERT events on the messages table
2. Filter the subscription to only messages where the current user is the receiver
3. When a new message arrives, add it to the local state
4. Clean up the subscription when leaving the chat

We also had to enable realtime on the messages table in Supabase:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

This was a significant learning experience in understanding WebSocket connections and event-driven architecture.

**Challenge 3: Service Filtering Breaking the Swiper**

Users reported that after changing service filters, the swiper would show 'Loading caregivers...' indefinitely even though matching caregivers existed.

**The Problem:**
When the filter changed, we were updating the filtered caregivers array but not resetting the card index. The swiper was trying to display card #15 when there were only 3 filtered results, causing an index out of bounds scenario.

**The Solution:**
We added a useEffect hook that watches the selectedService state:
```javascript
useEffect(() => {
  // Filter logic here
  setCardIndex(0); // Reset to first card
}, [selectedService, allCaregivers]);
```

This ensures the swiper always starts at the beginning when filters change. It seems obvious in retrospect, but it taught us to think about edge cases and state synchronization.

**Challenge 4: Error Messages Not Visible in Browsers**

During peer testing, users reported they couldn't see error messages when entering wrong passwords or duplicate emails.

**The Problem:**
We were using React Native's Alert.alert() which works perfectly on mobile devices but doesn't display properly in web browsers - it either doesn't show at all or appears as a browser alert that's easy to miss.

**The Solution:**
We implemented a dual error system:
1. Added errorMessage state to track current errors
2. Created a visible error component that displays on-screen with red styling
3. Kept Alert.alert() as a backup for mobile
4. Made errors auto-clear when users start typing

This taught us the importance of cross-platform testing and not assuming that APIs work the same across all platforms.

**Challenge 5: Array Dimension Error in SQL**

When trying to bulk-insert 15 demo caregiver profiles, PostgreSQL threw an error about multidimensional arrays having mismatched dimensions.

**The Problem:**
We were trying to store an array of service arrays (2D array) where each inner array had different lengths:
```sql
ARRAY[
  ARRAY['Pet Sitting'],
  ARRAY['Pet Sitting', 'Dog Walking', 'Grooming'],
  ...
]
```

PostgreSQL requires all rows in a multidimensional array to have the same size.

**The Solution:**
We refactored the SQL to insert caregivers one at a time using DO blocks, defining the services array for each caregiver individually. This was more verbose but worked reliably and made the code more maintainable.

These challenges taught us valuable lessons about database constraints, security policies, real-time systems, cross-platform development, and the importance of thorough testing across different environments."

---

## SECTION 8: FUTURE ENHANCEMENTS & CONCLUSION (1.5 minutes)
**Speaker:**
"While PetLink is fully functional and production-ready, there are several features we'd like to add in future iterations:

**Near-term Enhancements:**
1. **Photo uploads** - Allow users to upload profile photos and pet photos instead of using emoji avatars
2. **Geolocation filtering** - Show caregivers sorted by distance from the user's location
3. **Booking system** - Let users book specific dates and times directly through the app
4. **Payment integration** - Process payments through Stripe for booked services
5. **Reviews and ratings** - Allow users to rate and review caregivers after service completion
6. **Push notifications** - Alert users to new messages and booking confirmations

**Long-term Vision:**
- Calendar integration for managing multiple bookings
- Video chat for virtual meet-and-greets before booking
- Background check verification system
- Insurance integration for peace of mind
- Community features like pet playdate organizing
- Analytics dashboard for caregivers to track their business

**What We've Accomplished:**

In this course, we've taken PetLink from an initial concept to a fully implemented, production-ready mobile application. We've:

✅ Designed and implemented a complete user authentication system
✅ Created an intuitive Tinder-style matching interface  
✅ Built a real-time messaging system with read receipts
✅ Developed comprehensive profile editing with pets and services
✅ Implemented service filtering and search functionality
✅ Established secure database architecture with Row Level Security
✅ Deployed a cross-platform application (web, iOS, Android ready)
✅ Solved complex technical challenges along the way
✅ Created a polished, professional UI/UX

This isn't a prototype or mockup - this is a real application that could be published to app stores today. Users can create accounts, browse caregivers, match with them, send messages in real-time, and manage their profiles and pets.

**Personal Reflection:**

This project has been an incredible learning experience. I've gained hands-on experience with:
- Full-stack development using modern frameworks
- Database design and security
- Real-time systems and WebSocket connections
- Cross-platform mobile development
- Problem-solving complex technical challenges
- Building production-ready applications from scratch

Thank you for watching this demo of PetLink. I'm excited about what we've built and proud to showcase it as part of my portfolio. If you'd like to try PetLink yourself or have any questions, please reach out. The code is available on GitHub, and we welcome feedback and contributions.

**[Show final screen with PetLink logo and contact information]**

Thank you!"

---

## DEMO EXECUTION NOTES:

**Total Time Breakdown:**
- Section 1 (Introduction): 1 min
- Section 2 (Onboarding): 2 min  
- Section 3 (Browsing): 3 min
- Section 4 (Messaging): 2.5 min
- Section 5 (Profile Editing): 2 min
- Section 6 (Technical Architecture): 2 min
- Section 7 (Challenges): 2 min
- Section 8 (Future & Conclusion): 1.5 min
**Total: ~16 minutes** (well over the 10-minute minimum)

**Recording Tips:**
1. Use screen recording software (QuickTime, OBS, or Zoom)
2. Record at 1080p for clarity
3. Speak clearly and at a moderate pace
4. Have the app open in a browser and ready to demonstrate
5. For messaging demo, have two browser windows ready
6. Test audio levels before recording
7. Consider adding captions for accessibility
8. Use cursor highlighting to show where you're clicking

**What to Show On Screen:**
- Live application running in browser
- Real interactions (swipes, messages, profile edits)
- Database tables in Supabase (briefly)
- Code snippets for technical sections (optional)
- Split screen for real-time messaging demo

**Professional Presentation Elements:**
- Clear introduction with name and project title
- Persona-focused narrative (Sarah throughout)
- Real features, no mockups
- Technical depth showing implementation
- Honest discussion of challenges
- Professional conclusion

This script fulfills all assignment requirements:
✅ 10+ minutes in length
✅ User scenarios from primary persona perspective
✅ Demonstrates all major features
✅ Shows final implementation (not prototype)
✅ Discusses technical details
✅ Explains challenges and solutions
✅ Professional presentation suitable for recruiters