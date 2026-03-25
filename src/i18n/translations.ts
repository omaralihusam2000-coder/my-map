export type TranslationKey = 
  | 'appName'
  | 'search'
  | 'searchPlaceholder'
  | 'route'
  | 'from'
  | 'to'
  | 'fromPlaceholder'
  | 'toPlaceholder'
  | 'calculateRoute'
  | 'favorites'
  | 'history'
  | 'addFavorite'
  | 'removeFavorite'
  | 'noFavorites'
  | 'noHistory'
  | 'clearHistory'
  | 'distance'
  | 'duration'
  | 'steps'
  | 'locateMe'
  | 'darkMode'
  | 'lightMode'
  | 'language'
  | 'loading'
  | 'error'
  | 'noResults'
  | 'copyLink'
  | 'linkCopied'
  | 'shareLocation'
  | 'taxiFare'
  | 'baseFare'
  | 'perKm'
  | 'estimatedFare'
  | 'offlineMessage'
  | 'disclaimer'
  | 'km'
  | 'min'
  | 'iqd'
  | 'searchHistory'
  | 'useAsStart'
  | 'useAsEnd'
  | 'setOnMap'
  | 'routeDisclaimer'
  | 'stepDepart'
  | 'stepArrive'
  | 'stepN'
  | 'pois'
  | 'startNavigation'
  | 'stopNavigation'
  | 'poiPlaces'
  | 'poiLoading'
  | 'poiError'
  | 'poiDisclaimer';

export const translations: Record<string, Record<TranslationKey, string>> = {
  ar: {
    appName: 'خريطة العراق',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن مكان في العراق...',
    route: 'مسار',
    from: 'من',
    to: 'إلى',
    fromPlaceholder: 'نقطة البداية...',
    toPlaceholder: 'الوجهة...',
    calculateRoute: 'احسب المسار',
    favorites: 'المفضلة',
    history: 'السجل',
    addFavorite: 'إضافة للمفضلة',
    removeFavorite: 'إزالة من المفضلة',
    noFavorites: 'لا توجد مفضلات بعد',
    noHistory: 'لا يوجد سجل بحث',
    clearHistory: 'مسح السجل',
    distance: 'المسافة',
    duration: 'الوقت',
    steps: 'الخطوات',
    locateMe: 'موقعي',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    language: 'اللغة',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ، حاول مرة أخرى',
    noResults: 'لا توجد نتائج',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط!',
    shareLocation: 'مشاركة موقعي',
    taxiFare: 'تقدير أجرة التاكسي',
    baseFare: 'الأجرة الأساسية (د.ع)',
    perKm: 'سعر الكيلومتر (د.ع)',
    estimatedFare: 'الأجرة التقديرية',
    offlineMessage: 'أنت غير متصل بالإنترنت. بعض الميزات قد لا تعمل.',
    disclaimer: 'بيانات الملاحة من OpenStreetMap/OSRM وقد تكون غير مكتملة.',
    km: 'كم',
    min: 'دقيقة',
    iqd: 'دينار عراقي',
    searchHistory: 'سجل البحث',
    useAsStart: 'تعيين كنقطة بداية',
    useAsEnd: 'تعيين كوجهة',
    setOnMap: 'تعيين على الخريطة',
    routeDisclaimer: 'تنبيه: بيانات المسارات من OSRM/OpenStreetMap وقد لا تكون دقيقة في بعض مناطق العراق.',
    stepDepart: '🚦 انطلق',
    stepArrive: '🏁 وصلت',
    stepN: 'خطوة',
    pois: 'أماكن',
    startNavigation: 'ابدأ الملاحة',
    stopNavigation: 'إيقاف الملاحة',
    poiPlaces: 'الأماكن',
    poiLoading: 'جاري تحميل الأماكن…',
    poiError: 'تعذر تحميل الأماكن، حاول لاحقاً',
    poiDisclaimer: 'بيانات الأماكن من OpenStreetMap وقد لا تكون مكتملة في بعض مناطق العراق.',
  },
  en: {
    appName: 'Iraq Map',
    search: 'Search',
    searchPlaceholder: 'Search for a place in Iraq...',
    route: 'Route',
    from: 'From',
    to: 'To',
    fromPlaceholder: 'Starting point...',
    toPlaceholder: 'Destination...',
    calculateRoute: 'Calculate Route',
    favorites: 'Favorites',
    history: 'History',
    addFavorite: 'Add to Favorites',
    removeFavorite: 'Remove from Favorites',
    noFavorites: 'No favorites yet',
    noHistory: 'No search history',
    clearHistory: 'Clear History',
    distance: 'Distance',
    duration: 'Duration',
    steps: 'Steps',
    locateMe: 'Locate Me',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    loading: 'Loading...',
    error: 'An error occurred, please try again',
    noResults: 'No results found',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
    shareLocation: 'Share My Location',
    taxiFare: 'Taxi Fare Estimate',
    baseFare: 'Base Fare (IQD)',
    perKm: 'Per KM Rate (IQD)',
    estimatedFare: 'Estimated Fare',
    offlineMessage: 'You are offline. Some features may not work.',
    disclaimer: 'Navigation data from OpenStreetMap/OSRM may be incomplete.',
    km: 'km',
    min: 'min',
    iqd: 'IQD',
    searchHistory: 'Search History',
    useAsStart: 'Use as Start',
    useAsEnd: 'Use as Destination',
    setOnMap: 'Set on Map',
    routeDisclaimer: 'Note: Route data from OSRM/OpenStreetMap may not be fully accurate in some areas of Iraq.',
    stepDepart: '🚦 Depart',
    stepArrive: '🏁 Arrive',
    stepN: 'Step',
    pois: 'Places',
    startNavigation: 'Start Navigation',
    stopNavigation: 'Stop Navigation',
    poiPlaces: 'POI Places',
    poiLoading: 'Loading places…',
    poiError: 'Could not load places, please try again later',
    poiDisclaimer: 'Place data from OpenStreetMap. Coverage may be incomplete in some areas of Iraq.',
  },
  ku: {
    appName: 'نەخشەی عێراق',
    search: 'گەڕان',
    searchPlaceholder: 'بگەڕێ بۆ شوێنێك...',
    route: 'ڕێگە',
    from: 'لە',
    to: 'بۆ',
    fromPlaceholder: 'خاڵی دەستپێک...',
    toPlaceholder: 'مەنزل...',
    calculateRoute: 'ڕێگەکە حیساب بکە',
    favorites: 'دڵخوازەکان',
    history: 'مێژوو',
    addFavorite: 'زیادکردن بۆ دڵخوازەکان',
    removeFavorite: 'لابردن لە دڵخوازەکان',
    noFavorites: 'هیچ دڵخوازێک نییە',
    noHistory: 'مێژووی گەڕان نییە',
    clearHistory: 'سڕینەوەی مێژوو',
    distance: 'دووری',
    duration: 'کات',
    steps: 'هەنگاوەکان',
    locateMe: 'شوێنم',
    darkMode: 'دۆخی تاریک',
    lightMode: 'دۆخی ڕووناک',
    language: 'زمان',
    loading: 'چاوەڕوانبە...',
    error: 'هەڵەیەک روویدا',
    noResults: 'هیچ ئەنجامێك نییە',
    copyLink: 'کۆپیکردنی بەستەر',
    linkCopied: 'بەستەر کۆپی کرا!',
    shareLocation: 'هاوبەشکردنی شوێنم',
    taxiFare: 'خەرجی تاکسی',
    baseFare: 'کرێی بنچینە',
    perKm: 'نرخی کیلۆمەتر',
    estimatedFare: 'خەرجی داڕێژراو',
    offlineMessage: 'بەبێ ئینتەرنێتیت. هەندێ تایبەتمەندی دەکرێ کار نەکات.',
    disclaimer: 'زانیاری ناوبەری لە OpenStreetMap/OSRM.',
    km: 'کم',
    min: 'خولەک',
    iqd: 'دینار',
    searchHistory: 'مێژووی گەڕان',
    useAsStart: 'دانان وەک دەستپێک',
    useAsEnd: 'دانان وەک مەنزل',
    setOnMap: 'دانان لەسەر نەخشە',
    routeDisclaimer: 'ئاگاداری: داتای ڕێگە لە OSRM/OpenStreetMap',
    stepDepart: '🚦 دەستپێبکە',
    stepArrive: '🏁 گەیشتیت',
    stepN: 'هەنگاو',
    pois: 'شوێنەکان',
    startNavigation: 'دەستپێکردنی ناوبەری',
    stopNavigation: 'ڕاگرتنی ناوبەری',
    poiPlaces: 'شوێنەکان',
    poiLoading: 'شوێنەکان بارکراون…',
    poiError: 'ناتوانرێت شوێنەکان بارکرێن، دواتر هەوڵبدەرەوە',
    poiDisclaimer: 'داتای شوێنەکان لە OpenStreetMap. پووشپەڕی ناچێت تەواو بێت.',
  },
};
