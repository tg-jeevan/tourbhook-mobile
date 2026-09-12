export const BASE_URL = 'http://32.193.3.150:8080/api/v1';

export const ApiPaths = {
  // Auth endpoints
  login: '/auth/login',
  register: '/auth/register',
  googleSignIn: '/auth/google',
  refreshToken: '/auth/refresh',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot-password',
  verifyOtp: '/auth/verify-otp',
  resetPassword: '/auth/reset-password',

  // Trip endpoints
  trips: '/trips',
  tripById: '/trips/', // + {id}
  generateItinerary: '/trips/generate',

  // Places-on-trip endpoints
  addPlaceToTrip: '/places/trip/add',
  removePlaceFromTrip: '/places/trip/remove',

  // Itinerary endpoints
  itineraries: '/itineraries',
  generateItineraryApi: '/itineraries/generate',
  itineraryById: '/itineraries/', // + {id}
  modifyItinerary: '/itineraries/', // + {id}
  itineraryActivities: '/itineraries/activities', // + /{id}
  addActivity: '/itineraries/', // + {id}/add-activity
  removeActivity: '/itineraries/remove-activity/', // + {activityId}

  // Places endpoints
  places: '/places',
  searchPlaces: '/places/search',
  suggestedPlaces: '/places/suggested',

  // Packing endpoints
  packingLists: '/packing',
  updateTransports: '/packing/', // + {tripId}/transports
  packingCategories: '/packing/categories',
  addPackingCategory: '/packing/', // + {tripId}/Addcategories
  addPackingItem: '/packing/', // + {tripId}/add-item

  // Profile endpoints
  profile: '/profile',
  updateProfile: '/profile/update',
  uploadAvatar: '/profile/upload-avatar',
  paymentMethods: '/profile/payments',
  addPaymentMethod: '/profile/Addpayments',
  subscription: '/profile/subscription',

  // Weather
  weather: '/weather', // ?city={city}&date={date}

  // Payments
  createOrder: '/payments/create-order',
  verifyPayment: '/payments/verify',
  getOrders: '/payments/orders',
  getInvoice: '/payments/orders/', // + {id}/invoice
} as const;

// Razorpay keys (test keys from the Flutter source)
export const RAZORPAY_KEY_ID = 'rzp_test_SXQRoyl0PBkiDH';
export const RAZORPAY_KEY_SECRET = 'TXRf4e8Xyyes7Cj7m65hSIyA';

export const GOOGLE_API_KEY = 'AIzaSyAjEqTpg277Jx1q9-_HbrwWSt_qb--u3eY';

// Timeouts, in milliseconds (Flutter uses 30s for both)
export const CONNECTION_TIMEOUT_MS = 30_000;
export const RECEIVE_TIMEOUT_MS = 30_000;

/** Paths that must NOT get an Authorization header attached. */
export const UNAUTHENTICATED_PATHS: string[] = [
  ApiPaths.login,
  ApiPaths.register,
  ApiPaths.googleSignIn,
  ApiPaths.refreshToken,
];