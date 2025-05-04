"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  Share2,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type UserType = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  joined: string;
  following: number;
  followers: number;
};

type Community = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  banner: string;
  icon: string;
  isJoined: boolean;
};

type Post = {
  id: string;
  communityId: string;
  userId: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
};

type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
  isLiked: boolean;
};

type Event = {
  id: string;
  communityId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  isAttending: boolean;
  banner: string;
};

type Notification = {
  id: string;
  type: "like" | "comment" | "follow" | "event";
  userId: string;
  targetId: string;
  read: boolean;
  createdAt: string;
};

// Mock Data
const currentUser: UserType = {
  id: "user-1",
  name: "Alex Johnson",
  username: "alexj",
  avatar:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  bio: "Digital enthusiast, community builder, and tech lover",
  joined: "January 2023",
  following: 128,
  followers: 256,
};

const mockCommunities: Community[] = [
  {
    id: "comm-1",
    name: "Tech Innovators",
    description:
      "A community for tech enthusiasts and innovators to share ideas and collaborate on projects.",
    members: 1250,
    category: "Technology",
    banner:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1887&auto=format&fit=crop",
    isJoined: true,
  },
  {
    id: "comm-2",
    name: "Creative Minds",
    description:
      "For artists, designers, and creative thinkers to share their work and get inspired.",
    members: 980,
    category: "Art & Design",
    banner:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1171&auto=format&fit=crop",
    isJoined: true,
  },
  {
    id: "comm-3",
    name: "Fitness Enthusiasts",
    description:
      "Share your fitness journey, tips, and motivate each other to reach your goals.",
    members: 2100,
    category: "Health & Fitness",
    banner:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1170&auto=format&fit=crop",
    isJoined: false,
  },
  {
    id: "comm-4",
    name: "Book Lovers",
    description:
      "Discuss your favorite books, authors, and literary topics with fellow book enthusiasts.",
    members: 1560,
    category: "Literature",
    banner:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop",
    isJoined: false,
  },
  {
    id: "comm-5",
    name: "Travel Adventurers",
    description:
      "Share your travel experiences, tips, and discover new destinations around the world.",
    members: 3200,
    category: "Travel",
    banner:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1173&auto=format&fit=crop",
    isJoined: true,
  },
];

const mockUsers: UserType[] = [
  {
    id: "user-2",
    name: "Sarah Miller",
    username: "sarahm",
    avatar:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "UX Designer and community enthusiast",
    joined: "March 2023",
    following: 89,
    followers: 134,
  },
  {
    id: "user-3",
    name: "David Chen",
    username: "davidc",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Software developer and open source contributor",
    joined: "November 2022",
    following: 156,
    followers: 201,
  },
  {
    id: "user-4",
    name: "Emily Rodriguez",
    username: "emilyr",
    avatar:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Digital marketer and content creator",
    joined: "February 2023",
    following: 112,
    followers: 178,
  },
  {
    id: "user-5",
    name: "Michael Johnson",
    username: "michaelj",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Product manager and tech enthusiast",
    joined: "April 2023",
    following: 95,
    followers: 120,
  },
  {
    id: "user-6",
    name: "Jessica Lee",
    username: "jessical",
    avatar:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Graphic designer and illustrator",
    joined: "January 2023",
    following: 78,
    followers: 143,
  },
];

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [];
  const contents = [
    "Just finished working on a new project! Can't wait to share it with everyone. #innovation #technology",
    "Looking for collaborators on a new open-source project. DM me if interested! #collaboration #opensource",
    "What's your favorite productivity tool? I've been using Notion lately and it's been a game-changer.",
    "Just published my latest article on AI advancements. Check it out and let me know your thoughts!",
    "Attended an amazing workshop yesterday on UX design. Learned so much! #UXDesign #learning",
    "Working on improving my coding skills. Any recommended resources for advanced JavaScript?",
    "Just joined this community and I'm excited to connect with like-minded individuals!",
    "Sharing my latest design work. Feedback is always appreciated! #design #feedback",
    "What books are you currently reading? Looking for recommendations in the tech/business space.",
    "Just launched my portfolio website! Would love some feedback from the community.",
  ];

  const imageUrls = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
  ];

  // Use deterministic assignments instead of random to avoid hydration errors
  for (let i = 0; i < 15; i++) {
    // Assign community, user, content and images deterministically based on index
    const communityIndex = i % mockCommunities.length;
    const userIndex = i % (mockUsers.length + 1); // +1 for currentUser
    const contentIndex = i % contents.length;
    const hasImage = i % 2 === 0; // Even indices have images
    const imageIndex = i % imageUrls.length;

    const randomCommunity = mockCommunities[communityIndex];
    const randomUser =
      userIndex === mockUsers.length ? currentUser : mockUsers[userIndex];
    const randomContent = contents[contentIndex];
    const images = hasImage ? [imageUrls[imageIndex]] : [];

    // Create deterministic timestamps
    const daysAgo = i % 7;
    const hoursAgo = i % 24;

    posts.push({
      id: `post-${i + 1}`,
      communityId: randomCommunity.id,
      userId: randomUser.id,
      content: randomContent,
      images,
      likes: 10 + i, // Deterministic like count
      comments: 5 + (i % 10), // Deterministic comment count
      createdAt: daysAgo > 0 ? `${daysAgo}d ago` : `${hoursAgo}h ago`,
      isLiked: i % 3 === 0, // Every 3rd post is liked
    });
  }

  return posts;
};

const generateMockComments = (posts: Post[]): Comment[] => {
  const comments: Comment[] = [];
  const commentContents = [
    "Great post! Thanks for sharing.",
    "This is really insightful. I've been thinking about this topic a lot lately.",
    "I'd love to collaborate on something like this. Let's connect!",
    "Interesting perspective. Have you considered looking at it from this angle?",
    "Thanks for sharing your experience. It's really helpful.",
    "I've been using a similar approach and it's been working well for me too.",
    "This is exactly what I needed to see today. Thank you!",
    "I have a question about this - would you mind elaborating a bit more?",
    "Great work! Looking forward to seeing more from you.",
    "I've bookmarked this for future reference. Really valuable content.",
  ];

  posts.forEach((post, postIndex) => {
    const commentCount = post.comments;
    for (let i = 0; i < commentCount; i++) {
      // Use deterministic assignment
      const userIndex = (postIndex + i) % mockUsers.length;
      const contentIndex = (postIndex + i) % commentContents.length;
      const randomUser = mockUsers[userIndex];
      const randomContent = commentContents[contentIndex];
      const minutesAgo = 5 + i * 10; // Deterministic time

      comments.push({
        id: `comment-${post.id}-${i + 1}`,
        postId: post.id,
        userId: randomUser.id,
        content: randomContent,
        likes: i * 2, // Deterministic likes
        createdAt: `${minutesAgo}m ago`,
        isLiked: i % 2 === 0, // Even indices are liked
      });
    }
  });

  return comments;
};

const generateMockEvents = (): Event[] => {
  const events: Event[] = [];
  const eventTitles = [
    "Tech Meetup: AI and Machine Learning",
    "Design Workshop: UI/UX Fundamentals",
    "Webinar: Future of Remote Work",
    "Networking Event: Connect with Industry Leaders",
    "Hackathon: Build Innovative Solutions",
    "Panel Discussion: Diversity in Tech",
    "Workshop: Advanced JavaScript Techniques",
    "Book Club: Discussion on 'Atomic Habits'",
    "Virtual Conference: Digital Transformation",
    "Community Showcase: Share Your Projects",
  ];

  const eventDescriptions = [
    "Join us for an insightful discussion on the latest advancements in AI and machine learning.",
    "Learn the fundamentals of UI/UX design in this hands-on workshop led by industry experts.",
    "Explore the future of remote work and how it's reshaping the way we collaborate.",
    "Connect with industry leaders and expand your professional network in this casual networking event.",
    "Put your skills to the test in this 24-hour hackathon to build innovative solutions for real-world problems.",
    "Join our panel discussion on diversity in tech and how we can create more inclusive workplaces.",
    "Dive deep into advanced JavaScript techniques and improve your coding skills.",
    "Join our book club discussion on 'Atomic Habits' by James Clear and share your insights.",
    "Attend our virtual conference on digital transformation and learn from industry experts.",
    "Showcase your projects and get feedback from the community in this collaborative event.",
  ];

  const locations = [
    "Virtual (Zoom)",
    "Tech Hub, Downtown",
    "Community Center",
    "Innovation Lab",
    "Central Library",
    "Co-working Space",
    "University Campus",
    "Conference Center",
    "Online (Discord)",
    "City Park",
  ];

  const bannerUrls = [
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
  ];

  // Generate future dates deterministically
  const generateFutureDate = (dayOffset: number) => {
    const today = new Date(2023, 0, 1); // Fixed date for consistent rendering
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + dayOffset);
    return futureDate;
  };

  for (let i = 0; i < 8; i++) {
    const communityIndex = i % mockCommunities.length;
    const titleIndex = i % eventTitles.length;
    const descriptionIndex = i % eventDescriptions.length;
    const locationIndex = i % locations.length;
    const bannerIndex = i % bannerUrls.length;

    const randomCommunity = mockCommunities[communityIndex];
    const randomTitle = eventTitles[titleIndex];
    const randomDescription = eventDescriptions[descriptionIndex];
    const randomLocation = locations[locationIndex];
    const futureDate = generateFutureDate(i + 1);
    const formattedDate = futureDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = `${(i % 12) + 1}:00 ${i < 12 ? "AM" : "PM"}`; // Deterministic time

    events.push({
      id: `event-${i + 1}`,
      communityId: randomCommunity.id,
      title: randomTitle,
      description: randomDescription,
      date: formattedDate,
      time: formattedTime,
      location: randomLocation,
      attendees: 10 + i * 5, // Deterministic attendee count
      isAttending: i % 2 === 0, // Every other event is being attended
      banner: bannerUrls[bannerIndex],
    });
  }

  // Sort events by date (closest first)
  events.sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return dateA.getTime() - dateB.getTime();
  });

  return events;
};

const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const notificationTypes: ("like" | "comment" | "follow" | "event")[] = [
    "like",
    "comment",
    "follow",
    "event",
  ];

  for (let i = 0; i < 10; i++) {
    const userIndex = i % mockUsers.length;
    const typeIndex = i % notificationTypes.length;
    const minutesAgo = 5 + i * 5; // Deterministic time

    notifications.push({
      id: `notif-${i + 1}`,
      type: notificationTypes[typeIndex],
      userId: mockUsers[userIndex].id,
      targetId: `target-${i + 1}`,
      read: i > 5, // First 6 are unread
      createdAt: `${minutesAgo}m ago`,
    });
  }

  return notifications;
};

// Analytics data for dashboard
const activityData = [
  { name: "Mon", posts: 4, comments: 8, likes: 12 },
  { name: "Tue", posts: 3, comments: 7, likes: 10 },
  { name: "Wed", posts: 5, comments: 9, likes: 15 },
  { name: "Thu", posts: 6, comments: 12, likes: 18 },
  { name: "Fri", posts: 8, comments: 15, likes: 24 },
  { name: "Sat", posts: 10, comments: 20, likes: 30 },
  { name: "Sun", posts: 7, comments: 14, likes: 22 },
];

const communityGrowthData = [
  { name: "Jan", members: 120 },
  { name: "Feb", members: 150 },
  { name: "Mar", members: 200 },
  { name: "Apr", members: 250 },
  { name: "May", members: 300 },
  { name: "Jun", members: 400 },
  { name: "Jul", members: 500 },
];

const engagementData = [
  { name: "Posts", value: 35 },
  { name: "Comments", value: 85 },
  { name: "Likes", value: 131 },
  { name: "Shares", value: 18 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Add these page transition variants after the COLORS constant
const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const listItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const listContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const buttonVariantsLocal = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export default function CommunityHub() {
  // Add these additional state variables for profile settings at the beginning of the component
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);
  const [emailNotifications, setEmailNotifications] = useState({
    posts: true,
    comments: true,
    events: true,
  });
  // Remove this line
  //const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "system">("light")
  // State
  const [activePage, setActivePage] = useState<
    "home" | "communities" | "events" | "dashboard"
  >("home");
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(
    mockCommunities[0]
  );
  const [activeTab, setActiveTab] = useState<"feed" | "events" | "members">(
    "feed"
  );
  const [posts, setPosts] = useState<Post[]>(generateMockPosts());
  const [comments, setComments] = useState<Comment[]>(
    generateMockComments(posts)
  );
  const [events, setEvents] = useState<Event[]>(generateMockEvents());
  const [notifications, setNotifications] = useState<Notification[]>(
    generateMockNotifications()
  );
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateCommunityModal, setShowCreateCommunityModal] =
    useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [activePostForComment, setActivePostForComment] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  // Add form state for new community and event
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    category: "Technology",
    privacy: "public",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    communityId: "",
  });

  // Add new state for avatar file
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add function to handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
      // Preview image immediately
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setProfileAvatar(fileURL);
    }
  };

  const notificationRef = useRef<HTMLDivElement>(null);
  const userProfileRef = useRef<HTMLDivElement>(null);

  // Filter posts based on active community
  const filteredPosts = activeCommunity
    ? posts.filter((post) => post.communityId === activeCommunity.id)
    : posts;

  // Filter events based on active community
  const filteredEvents = activeCommunity
    ? events.filter((event) => event.communityId === activeCommunity.id)
    : events;

  // Get community members (mock data)
  const communityMembers = activeCommunity
    ? [...mockUsers]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(mockUsers.length, 10))
    : [];

  // Handle outside click for notifications
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userProfileRef.current &&
        !userProfileRef.current.contains(event.target as Node)
      ) {
        setShowUserProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle like post
  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Handle like comment
  const handleLikeComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.isLiked;
          return {
            ...comment,
            isLiked: newIsLiked,
            likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
          };
        }
        return comment;
      })
    );
  };

  // Handle join community
  const handleJoinCommunity = (communityId: string) => {
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) => {
        if (community.id === communityId) {
          const newIsJoined = !community.isJoined;
          return {
            ...community,
            isJoined: newIsJoined,
            members: newIsJoined
              ? community.members + 1
              : community.members - 1,
          };
        }
        return community;
      })
    );
  };

  // Handle attend event
  const handleAttendEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const newIsAttending = !event.isAttending;
          return {
            ...event,
            isAttending: newIsAttending,
            attendees: newIsAttending
              ? event.attendees + 1
              : event.attendees - 1,
          };
        }
        return event;
      })
    );
  };

  // Update the handleCreatePost function to be more functional
  const handleCreatePost = () => {
    if (!newPostContent.trim() && !newPostImage.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      communityId: activeCommunity?.id || "comm-1",
      userId: currentUser.id,
      content: newPostContent,
      images: newPostImage ? [newPostImage] : [],
      likes: 0,
      comments: 0,
      createdAt: "Just now",
      isLiked: false,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setNewPostContent("");
    setNewPostImage("");
    setShowCreatePostModal(false);
  };

  // Handle create comment
  const handleCreateComment = (postId: string) => {
    if (!newCommentContent.trim()) return;

    const newComment: Comment = {
      id: `comment-${postId}-${Date.now()}`,
      postId,
      userId: currentUser.id,
      content: newCommentContent,
      likes: 0,
      createdAt: "Just now",
      isLiked: false,
    };

    setComments((prevComments) => [...prevComments, newComment]);

    // Update comment count on post
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          };
        }
        return post;
      })
    );

    setNewCommentContent("");
    setActivePostForComment(null);
  };

  // Handle create community
  const handleCreateCommunity = () => {
    if (!newCommunity.name.trim()) return;

    const newCommunityObj: Community = {
      id: `comm-${Date.now()}`,
      name: newCommunity.name,
      description: newCommunity.description,
      members: 1,
      category: newCommunity.category,
      banner:
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop",
      icon: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=2070&auto=format&fit=crop",
      isJoined: true,
    };

    setCommunities((prevCommunities) => [newCommunityObj, ...prevCommunities]);

    // Reset form and close modal
    setNewCommunity({
      name: "",
      description: "",
      category: "Technology",
      privacy: "public",
    });
    setShowCreateCommunityModal(false);
  };

  // Handle create event
  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) return;

    const newEventObj: Event = {
      id: `event-${Date.now()}`,
      communityId: newEvent.communityId || activeCommunity?.id || "comm-1",
      title: newEvent.title,
      description: newEvent.description,
      date: new Date(newEvent.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: newEvent.time,
      location: newEvent.location || "Virtual (Zoom)",
      attendees: 1,
      isAttending: true,
      banner:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    };

    setEvents((prevEvents) => [newEventObj, ...prevEvents]);

    // Reset form and close modal
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      communityId: "",
    });
    setShowCreateEventModal(false);
  };

  // Get user by ID
  const getUserById = (userId: string): UserType => {
    if (userId === currentUser.id) return currentUser;
    return mockUsers.find((user) => user.id === userId) || currentUser;
  };

  // Format notification message
  const formatNotificationMessage = (notification: Notification): string => {
    const user = getUserById(notification.userId);

    switch (notification.type) {
      case "like":
        return `${user.name} liked your post`;
      case "comment":
        return `${user.name} commented on your post`;
      case "follow":
        return `${user.name} started following you`;
      case "event":
        return `New event in a community you follow`;
      default:
        return "";
    }
  };

  // Render user avatar
  const renderUserAvatar = (userId: string, size = 10) => {
    const user = getUserById(userId);
    return (
      <div
        className={`relative h-${size} w-${size} overflow-hidden rounded-full`}
      >
        <Image
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          width={size * 4}
          height={size * 4}
          className="object-cover"
        />
      </div>
    );
  };

  // Add a function to handle profile updates
  const handleProfileUpdate = () => {
    // Convert file to URL if available
    if (avatarFile) {
      const fileURL = URL.createObjectURL(avatarFile);
      setProfileAvatar(fileURL);
    }

    // Update the current user with the new profile information
    const updatedUser = {
      ...currentUser,
      name: profileName,
      bio: profileBio,
      avatar: profileAvatar,
    };

    // In a real app, you would send this to an API
    // For now, we'll just update the local state
    setShowSettingsModal(false);

    // Show a toast or notification (simulated)
    alert("Profile updated successfully!");
  };

  // Remove this function
  // const handleThemeChange = (theme: "light" | "dark" | "system") => {
  //   setActiveTheme(theme)
  //   // In a real app, you would apply the theme to the document
  //   // For demo purposes, we'll just update the state
  // }

  // Render post with enhanced animations
  const renderPost = (post: Post) => {
    const user = getUserById(post.userId);
    const postComments = comments.filter(
      (comment) => comment.postId === post.id
    );

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4"
        layout
      >
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.createdAt}
                </p>
              </div>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className="mt-2 text-sm">{post.content}</p>
            {post.images.length > 0 && (
              <motion.div
                className="mt-3 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={post.images[0] || "/placeholder.svg"}
                  alt="Post image"
                  width={500}
                  height={300}
                  className="w-full object-cover max-h-80"
                />
              </motion.div>
            )}
            <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-1 ${
                  post.isLiked ? "text-red-500 dark:text-red-400" : ""
                }`}
                onClick={() => handleLikePost(post.id)}
              >
                <Heart
                  size={16}
                  className={post.isLiked ? "fill-current" : ""}
                />
                <span>{post.likes}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1"
                onClick={() =>
                  setActivePostForComment(
                    activePostForComment === post.id ? null : post.id
                  )
                }
              >
                <MessageSquare size={16} />
                <span>{post.comments}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1"
              >
                <Share2 size={16} />
              </motion.button>
            </div>

            {/* Comment section with animations */}
            <AnimatePresence>
              {activePostForComment === post.id && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start mb-4">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt={currentUser.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newCommentContent.trim()) {
                            handleCreateComment(post.id);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {postComments.length > 0 && (
                    <motion.div
                      className="space-y-3 mt-2"
                      variants={listContainerVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {postComments.map((comment) => {
                        const commentUser = getUserById(comment.userId);
                        return (
                          <motion.div
                            key={comment.id}
                            className="flex items-start"
                            variants={listItemVariants}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                              <Image
                                src={commentUser.avatar || "/placeholder.svg"}
                                alt={commentUser.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-xs">
                                  {commentUser.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {comment.createdAt}
                                </p>
                              </div>
                              <p className="text-sm mt-1">{comment.content}</p>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`mt-1 text-xs flex items-center space-x-1 ${
                                  comment.isLiked
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                                onClick={() => handleLikeComment(comment.id)}
                              >
                                <Heart
                                  size={12}
                                  className={
                                    comment.isLiked ? "fill-current" : ""
                                  }
                                />
                                <span>{comment.likes}</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render event card with enhanced animations
  const renderEventCard = (event: Event, isCompact = false) => {
    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden ${
          isCompact ? "mb-3" : "mb-4"
        }`}
      >
        <div className="relative h-32 w-full">
          <Image
            src={event.banner || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={128}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-sm font-semibold">{event.date}</p>
            <p className="text-xs opacity-90">{event.time}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
          {!isCompact && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {event.description}
            </p>
          )}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="mr-3">{event.location}</span>
            <span>{event.attendees} attending</span>
          </div>
          <motion.button
            variants={buttonVariantsLocal}
            whileHover="hover"
            whileTap="tap"
            className={`w-full py-2 rounded-lg text-sm font-medium ${
              event.isAttending
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            }`}
            onClick={() => handleAttendEvent(event.id)}
          >
            {event.isAttending ? "Attending" : "Attend"}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render community card with enhanced animations
  const renderCommunityCard = (community: Community) => {
    return (
      <motion.div
        key={community.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4"
      >
        <div className="relative h-32 w-full">
          <Image
            src={community.banner || "/placeholder.svg"}
            alt={community.name}
            width={400}
            height={128}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={community.icon || "/placeholder.svg"}
                  alt={community.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="ml-2 text-white">
                <h3 className="font-semibold text-sm">{community.name}</h3>
                <p className="text-xs opacity-90">
                  {community.members} members
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
            {community.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {community.description}
          </p>
          <div className="flex justify-between items-center">
            <motion.button
              variants={buttonVariantsLocal}
              whileHover="hover"
              whileTap="tap"
              className={`py-2 px-4 rounded-lg text-sm font-medium ${
                community.isJoined
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              }`}
              onClick={() => handleJoinCommunity(community.id)}
            >
              {community.isJoined ? "Joined" : "Join"}
            </motion.button>
            <motion.button
              variants={buttonVariantsLocal}
              whileHover="hover"
              whileTap="tap"
              className="py-2 px-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => {
                setActiveCommunity(community);
                setActivePage("communities");
                setActiveTab("feed");
              }}
            >
              View
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render member card
  const renderMemberCard = (user: UserType) => {
    return (
      <motion.div
        key={user.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 flex items-center"
      >
        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{user.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
        </div>
        <button className="py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
          Follow
        </button>
      </motion.div>
    );
  };

  // Replace the main content wrapper with framer-motion
  // Find the return statement and replace the outer div with:
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={24} />
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CommunityHub
                </h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-1">
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === "home"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActivePage("home")}
                >
                  Home
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === "communities"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => {
                    setActivePage("communities");
                    setActiveTab("feed");
                  }}
                >
                  Communities
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === "events"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActivePage("events")}
                >
                  Events
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === "dashboard"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActivePage("dashboard")}
                >
                  Dashboard
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative flex-1 max-w-xs mr-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                  />
                </div>
                {isSearchFocused && (
                  <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Quick Search
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 mr-2" />
                        <span>Communities</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span>Events</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span>People</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={notificationRef}>
                <button
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span>Notifications</span>
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                            !notification.read
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                              <Image
                                src={
                                  getUserById(notification.userId).avatar ||
                                  "/placeholder.svg"
                                }
                                alt={getUserById(notification.userId).name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                {formatNotificationMessage(notification)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.createdAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-3 relative" ref={userProfileRef}>
                <button
                  className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 transition-all hover:ring-blue-400"
                  onClick={() => setShowUserProfile(!showUserProfile)}
                >
                  <Image
                    src={profileAvatar || "/placeholder.svg"}
                    alt={profileName}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </button>
                {showUserProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold">{profileName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{currentUser.username}
                      </p>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50"
          >
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CommunityHub
                </h1>
                <button
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium mb-2 ${
                    activePage === "home"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => {
                    setActivePage("home");
                    setShowMobileMenu(false);
                  }}
                >
                  Home
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium mb-2 ${
                    activePage === "communities"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => {
                    setActivePage("communities");
                    setActiveTab("feed");
                    setShowMobileMenu(false);
                  }}
                >
                  Communities
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium mb-2 ${
                    activePage === "events"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => {
                    setActivePage("events");
                    setShowMobileMenu(false);
                  }}
                >
                  Events
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium mb-2 ${
                    activePage === "dashboard"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => {
                    setActivePage("dashboard");
                    setShowMobileMenu(false);
                  }}
                >
                  Dashboard
                </button>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={profileAvatar || "/placeholder.svg"}
                      alt={profileName}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{profileName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - wrap with motion.main */}
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Home page */}
        {activePage === "home" && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[500px] rounded-xl overflow-hidden mb-8 shadow-xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop"
                  alt="Community Connections"
                  width={1200}
                  height={500}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/60 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                      Connect. Share. Grow.
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
                      Join vibrant communities of like-minded individuals, share
                      your passions, and discover new experiences together.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        variants={buttonVariantsLocal}
                        whileHover="hover"
                        whileTap="tap"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
                        onClick={() => setShowCreateCommunityModal(true)}
                      >
                        Create Community
                      </motion.button>
                      <motion.button
                        variants={buttonVariantsLocal}
                        whileHover="hover"
                        whileTap="tap"
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/40"
                        onClick={() => setActivePage("communities")}
                      >
                        Explore Communities
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="absolute bottom-[-100px] right-[-50px] w-[400px] h-[400px] bg-blue-500/30 rounded-full"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-[-50px] right-[100px] w-[300px] h-[300px] bg-purple-500/30 rounded-full"
                  ></motion.div>
                </div>

                <div className="absolute bottom-6 left-8 flex space-x-2">
                  <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse"></span>
                  <span
                    className="h-2 w-2 rounded-full bg-white/60 animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  ></span>
                  <span
                    className="h-2 w-2 rounded-full bg-white/40 animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  ></span>
                </div>
              </motion.div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => renderPost(post))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Your Communities</h2>
                <div className="space-y-3">
                  {communities
                    .filter((c) => c.isJoined)
                    .map((community) => (
                      <div
                        key={community.id}
                        className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => {
                          setActiveCommunity(community);
                          setActivePage("communities");
                          setActiveTab("feed");
                        }}
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={community.icon || "/placeholder.svg"}
                            alt={community.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {community.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {community.members} members
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setActivePage("communities")}
                >
                  View All Communities
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                      onClick={() => setActivePage("events")}
                    >
                      <div className="h-10 w-10 rounded-lg overflow-hidden mr-3">
                        <Image
                          src={event.banner || "/placeholder.svg"}
                          alt={event.title}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{event.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {event.date}
                        </p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.isAttending
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {event.isAttending ? "Attending" : "RSVP"}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setActivePage("events")}
                >
                  View All Events
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-3">
                  People You May Know
                </h2>
                <div className="space-y-3">
                  {mockUsers.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{user.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </p>
                      </div>
                      <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Communities page */}
        {activePage === "communities" && (
          <div>
            {activeCommunity ? (
              <div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
                  <Image
                    src={activeCommunity.banner || "/placeholder.svg"}
                    alt={activeCommunity.name}
                    width={1200}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={activeCommunity.icon || "/placeholder.svg"}
                          alt={activeCommunity.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3 text-white">
                        <h1 className="text-2xl font-bold">
                          {activeCommunity.name}
                        </h1>
                        <p className="text-sm opacity-90">
                          {activeCommunity.members} members
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        activeCommunity.isJoined
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      }`}
                      onClick={() => handleJoinCommunity(activeCommunity.id)}
                    >
                      {activeCommunity.isJoined ? "Joined" : "Join"}
                    </button>
                  </div>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "feed"
                        ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("feed")}
                  >
                    Feed
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "events"
                        ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("events")}
                  >
                    Events
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "members"
                        ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("members")}
                  >
                    Members
                  </button>
                </div>

                {activeTab === "feed" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src={currentUser.avatar || "/placeholder.svg"}
                              alt={currentUser.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={() => setShowCreatePostModal(true)}
                          >
                            What's on your mind?
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {filteredPosts.map((post) => renderPost(post))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <h2 className="text-lg font-semibold mb-3">About</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {activeCommunity.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="font-medium mr-2">Category:</span>
                          <span>{activeCommunity.category}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium mr-2">Members:</span>
                          <span>{activeCommunity.members}</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg font-semibold">
                            Upcoming Events
                          </h2>
                          <button
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={() => setActiveTab("events")}
                          >
                            View All
                          </button>
                        </div>
                        <div className="space-y-3">
                          {filteredEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                              onClick={() => setActiveTab("events")}
                            >
                              <div className="h-10 w-10 rounded-lg overflow-hidden mr-3">
                                <Image
                                  src={event.banner || "/placeholder.svg"}
                                  alt={event.title}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">
                                  {event.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {event.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg font-semibold">Members</h2>
                          <button
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={() => setActiveTab("members")}
                          >
                            View All
                          </button>
                        </div>
                        <div className="space-y-3">
                          {communityMembers.slice(0, 5).map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                <Image
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={user.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">
                                  {user.name}
                                </h3>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "events" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Upcoming Events</h2>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        onClick={() => setShowCreateEventModal(true)}
                      >
                        Create Event
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => renderEventCard(event))}
                    </div>
                  </div>
                )}

                {activeTab === "members" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Members</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {communityMembers.map((user) => renderMemberCard(user))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Communities</h1>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    onClick={() => setShowCreateCommunityModal(true)}
                  >
                    Create Community
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communities.map((community) =>
                    renderCommunityCard(community)
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events page */}
        {activePage === "events" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Events</h1>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                onClick={() => setShowCreateEventModal(true)}
              >
                Create Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => renderEventCard(event))}
            </div>
          </div>
        )}

        {/* Dashboard page */}
        {activePage === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-2">Communities</h3>
                <p className="text-3xl font-bold">
                  {communities.filter((c) => c.isJoined).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Communities joined
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-2">Events</h3>
                <p className="text-3xl font-bold">
                  {events.filter((e) => e.isAttending).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Events attending
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-2">Engagement</h3>
                <p className="text-3xl font-bold">
                  {posts.filter((p) => p.userId === currentUser.id).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posts created
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Activity Overview
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={activityData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="posts"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="comments"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                      <Area
                        type="monotone"
                        dataKey="likes"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Community Growth</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={communityGrowthData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="members" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Engagement Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {engagementData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Your Communities</h3>
                <div className="space-y-3">
                  {communities
                    .filter((c) => c.isJoined)
                    .map((community) => (
                      <div
                        key={community.id}
                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => {
                          setActiveCommunity(community);
                          setActivePage("communities");
                          setActiveTab("feed");
                        }}
                      >
                        <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                          <Image
                            src={community.icon || "/placeholder.svg"}
                            alt={community.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{community.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {community.members} members
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {
                            posts.filter((p) => p.communityId === community.id)
                              .length
                          }{" "}
                          posts
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                CommunityHub
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Connect, Share, Grow
              </p>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-6">
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2"
                onClick={() => setActivePage("home")}
              >
                Home
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2"
                onClick={() => {
                  setActivePage("communities");
                  setActiveTab("feed");
                }}
              >
                Communities
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2"
                onClick={() => setActivePage("events")}
              >
                Events
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2"
                onClick={() => setActivePage("dashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CommunityHub. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Create Post</h2>
                <button
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowCreatePostModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      {currentUser.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Posting to: </span>
                      <div className="flex items-center ml-1">
                        <span className="font-medium">
                          {activeCommunity?.name || "All Communities"}
                        </span>
                        <ChevronDown size={14} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <textarea
                  placeholder="What's on your mind?"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                ></textarea>
                {newPostImage && (
                  <div className="mt-3 relative">
                    <Image
                      src={newPostImage || "/placeholder.svg"}
                      alt="Post preview"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-70 rounded-full text-white"
                      onClick={() => setNewPostImage("")}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() =>
                        setNewPostImage(
                          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
                        )
                      }
                    >
                      <Image
                        src="/placeholder.svg"
                        alt="Post preview"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      newPostContent.trim() || newPostImage
                        ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                    }`}
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostImage}
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <button
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowSettingsModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden mr-4 relative group">
                    <Image
                      src={profileAvatar || "/placeholder.svg"}
                      alt={profileName}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="text-white text-xs">Change</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{profileName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{currentUser.username}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <button
                      className="text-xs text-blue-600 dark:text-blue-400 mt-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload new avatar
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Notifications
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notify-posts"
                          className="mr-2"
                          checked={emailNotifications.posts}
                          onChange={(e) =>
                            setEmailNotifications({
                              ...emailNotifications,
                              posts: e.target.checked,
                            })
                          }
                        />
                        <label htmlFor="notify-posts">
                          New posts in my communities
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notify-comments"
                          className="mr-2"
                          checked={emailNotifications.comments}
                          onChange={(e) =>
                            setEmailNotifications({
                              ...emailNotifications,
                              comments: e.target.checked,
                            })
                          }
                        />
                        <label htmlFor="notify-comments">
                          Comments on my posts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notify-events"
                          className="mr-2"
                          checked={emailNotifications.events}
                          onChange={(e) =>
                            setEmailNotifications({
                              ...emailNotifications,
                              events: e.target.checked,
                            })
                          }
                        />
                        <label htmlFor="notify-events">Upcoming events</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end sticky bottom-0 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <motion.button
                    variants={buttonVariantsLocal}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium mr-3 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    variants={buttonVariantsLocal}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateCommunityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Create Community</h2>
                <button
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowCreateCommunityModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Community Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter community name"
                      value={newCommunity.name}
                      onChange={(e) =>
                        setNewCommunity({
                          ...newCommunity,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                      placeholder="Describe your community"
                      value={newCommunity.description}
                      onChange={(e) =>
                        setNewCommunity({
                          ...newCommunity,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunity.category}
                      onChange={(e) =>
                        setNewCommunity({
                          ...newCommunity,
                          category: e.target.value,
                        })
                      }
                    >
                      <option>Technology</option>
                      <option>Art & Design</option>
                      <option>Health & Fitness</option>
                      <option>Literature</option>
                      <option>Travel</option>
                      <option>Gaming</option>
                      <option>Food & Cooking</option>
                      <option>Music</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Privacy
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="public"
                          name="privacy"
                          className="mr-2"
                          defaultChecked
                        />
                        <label htmlFor="public">
                          Public - Anyone can view and join
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="private"
                          name="privacy"
                          className="mr-2"
                        />
                        <label htmlFor="private">
                          Private - Only members can view content
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium mr-3 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setShowCreateCommunityModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    onClick={handleCreateCommunity}
                  >
                    Create Community
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Create Event</h2>
                <button
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowCreateEventModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                      placeholder="Describe your event"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newEvent.date}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newEvent.time}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, time: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location or 'Virtual'"
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Community
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEvent.communityId}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          communityId: e.target.value,
                        })
                      }
                    >
                      {communities
                        .filter((c) => c.isJoined)
                        .map((community) => (
                          <option key={community.id} value={community.id}>
                            {community.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium mr-3 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setShowCreateEventModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    onClick={handleCreateEvent}
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
