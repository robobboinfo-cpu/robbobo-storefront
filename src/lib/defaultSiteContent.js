export const defaultSiteContent = {
  storeBrand: {
    name: 'Robbobo',
    wordmark: 'ROBBOBO',
    accent: '#f97316',
    dark: '#131921',
    tagline: 'Smart shopping for everyday living',
    description: 'Robbobo is a single-store retail shop for electronics, home upgrades, beauty, fashion, and family essentials.',
    supportEmail: 'care@robbobo.com',
    supportPhone: '+233 30 000 0000',
    supportLocation: 'Accra, Ghana',
    supportLocationNote: 'Operations and fulfillment base',
    deliveryLabel: 'Ghana',
    copyrightLine: '© 2026 Robbobo. All rights reserved.',
  },
  categories: [
    { name: 'Electronics', icon: 'Devices', description: 'Audio, mobile accessories, work-from-home gear, and smart tech.', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&h=700&fit=crop' },
    { name: 'Fashion', icon: 'Style', description: 'Modern wardrobe staples, footwear, bags, and everyday looks.', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&h=700&fit=crop' },
    { name: 'Home & Living', icon: 'Home', description: 'Kitchen, decor, bedding, storage, and better living essentials.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=700&fit=crop' },
    { name: 'Beauty', icon: 'Care', description: 'Skincare, grooming, makeup, and wellness picks.', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&h=700&fit=crop' },
    { name: 'Sports', icon: 'Active', description: 'Fitness gear, hydration, outdoor kits, and recovery tools.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=700&fit=crop&q=85' },
    { name: 'Kids & Toys', icon: 'Play', description: 'Learning toys, games, beginner sport gear, and creative play.', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&h=700&fit=crop' },
  ],
  homeContent: {
    mobileMenu: {
      kicker: 'Browse',
      heading: 'Browse Robbobo',
      signInLabel: 'Sign in',
      homeLabel: 'Robbobo Home',
      quickLinksLabel: 'Quick links',
      featuredLabel: 'Trending',
      departmentsLabel: 'Top Departments',
      seeAllLabel: 'See all',
      seeLessLabel: 'See less',
    },
    fallbackSlides: [
      { title: 'Refresh your home for less', subtitle: 'Furniture, storage, kitchen upgrades, and decor picks across every room.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=700&fit=crop&q=85', buttonText: 'Shop home', targetUrl: '/category/Home%20%26%20Living' },
      { title: 'Get your game on', subtitle: 'Gaming accessories, audio gear, and electronics deals all in one place.', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&h=700&fit=crop&q=85', buttonText: 'Shop electronics', targetUrl: '/category/Electronics' },
      { title: 'Shop fashion for less', subtitle: 'Daily wardrobe picks, shoes, and accessories with fast checkout.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=700&fit=crop&q=85', buttonText: 'Shop fashion', targetUrl: '/category/Fashion' },
    ],
    panelSets: [
      { title: "Today's deals", route: '/products?deals=true', source: 'deals', panelBackground: 'linear-gradient(180deg, #fff4df 0%, #ffffff 78%)', tileBackground: '#fff1d6' },
      { title: 'Get your game on', route: '/category/Electronics', source: 'Electronics', panelBackground: 'linear-gradient(180deg, #f5e8ff 0%, #ffffff 78%)', tileBackground: '#efe0ff' },
      { title: 'Shop fashion for less', route: '/category/Fashion', source: 'Fashion', panelBackground: 'linear-gradient(180deg, #f5f9e8 0%, #ffffff 78%)', tileBackground: '#edf4dd' },
      { title: 'Must-have school supplies', route: '/category/Kids%20%26%20Toys', source: 'Kids & Toys', panelBackground: 'linear-gradient(180deg, #e8f9ff 0%, #ffffff 78%)', tileBackground: '#dff7ff' },
      { title: 'Top categories in kitchen appliances', route: '/category/Home%20%26%20Living', source: 'Home & Living', panelBackground: 'linear-gradient(180deg, #f7f5ef 0%, #ffffff 78%)', tileBackground: '#f1f1ee' },
      { title: 'New home arrivals under GHc500', route: '/category/Home%20%26%20Living', source: 'Home & Living', panelBackground: 'linear-gradient(180deg, #faf6ea 0%, #ffffff 78%)', tileBackground: '#f4f2eb' },
      { title: 'Fashion trends you like', route: '/category/Fashion', source: 'Fashion', panelBackground: 'linear-gradient(180deg, #f6faea 0%, #ffffff 78%)', tileBackground: '#eef4dc' },
      { title: 'Easy updates for elevated spaces', route: '/category/Home%20%26%20Living', source: 'Home & Living', panelBackground: 'linear-gradient(180deg, #f8f4ed 0%, #ffffff 78%)', tileBackground: '#f3efe8' },
      { title: 'Most-loved watches', route: '/category/Fashion', source: 'Fashion', panelBackground: 'linear-gradient(180deg, #eff7ea 0%, #ffffff 78%)', tileBackground: '#eaf3e4' },
      { title: 'Level up your gaming', route: '/category/Electronics', source: 'Electronics', panelBackground: 'linear-gradient(180deg, #f0e6ff 0%, #ffffff 78%)', tileBackground: '#e7dbff' },
      { title: 'Level up your PC here', route: '/category/Electronics', source: 'newest', panelBackground: 'linear-gradient(180deg, #ebf4ff 0%, #ffffff 78%)', tileBackground: '#e6f0ff' },
      { title: 'Gear up to get fit', route: '/category/Sports', source: 'Sports', panelBackground: 'linear-gradient(180deg, #fff4ad 0%, #ffffff 78%)', tileBackground: '#ffe46a' },
      { title: 'Everyday beauty finds', route: '/category/Beauty', source: 'Beauty', panelBackground: 'linear-gradient(180deg, #ffeaf0 0%, #ffffff 78%)', tileBackground: '#ffe2ea' },
      { title: 'Made for kids', route: '/category/Kids%20%26%20Toys', source: 'Kids & Toys', panelBackground: 'linear-gradient(180deg, #fff1dd 0%, #ffffff 78%)', tileBackground: '#ffe9cc' },
      { title: 'Recommended for your cart', route: '/products', source: 'recommended', panelBackground: 'linear-gradient(180deg, #f3f7fb 0%, #ffffff 78%)', tileBackground: '#eef3f8' },
    ],
    mobileFeatureSections: [
      {
        title: 'Top picks for Ghana',
        ctaLabel: 'Shop more',
        ctaRoute: '/products?sort=popular',
        items: [
          { label: 'Travel', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Sports' },
          { label: 'Office', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Family', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Kids%20%26%20Toys' },
          { label: 'Wellness', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Beauty' },
        ],
      },
      {
        title: 'Create your space',
        ctaLabel: 'See more',
        ctaRoute: '/category/Home%20%26%20Living',
        items: [
          { label: 'Candles', image: 'https://images.unsplash.com/photo-1602872029708-84d970d33846?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Stylish pillows', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Wall decor', image: 'https://images.unsplash.com/photo-1464890100898-a385f744067f?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Kitchen storage', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
        ],
      },
      {
        title: 'Look your best this season',
        ctaLabel: 'See more',
        ctaRoute: '/category/Fashion',
        items: [
          { label: 'For Her', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Fashion' },
          { label: 'For Him', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Fashion' },
          { label: 'For Teens', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Fashion' },
          { label: 'For Kids', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Kids%20%26%20Toys' },
        ],
      },
      {
        title: 'Gear up to get fit',
        ctaLabel: 'Shop more',
        ctaRoute: '/category/Sports',
        items: [
          { label: 'Clothing', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Sports' },
          { label: 'Trackers', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Sports' },
          { label: 'Equipment', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Sports' },
          { label: 'Deals', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=800&fit=crop&q=85', targetUrl: '/products?deals=true' },
        ],
      },
      {
        title: 'New home arrivals under GHc500',
        ctaLabel: 'Shop the latest from Home',
        ctaRoute: '/category/Home%20%26%20Living',
        items: [
          { label: 'Kitchen & dining', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Home improvement', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Decor', image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
          { label: 'Bedding & bath', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
        ],
      },
      {
        title: 'Discover the latest arrivals',
        ctaLabel: 'Shop new arrivals',
        ctaRoute: '/products?sort=newest',
        items: [
          { label: 'PC', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Electronics' },
          { label: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Beauty' },
          { label: 'Style', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Fashion' },
          { label: 'Home', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Home%20%26%20Living' },
        ],
      },
      {
        title: 'Refresh your tech setup',
        ctaLabel: 'Explore electronics',
        ctaRoute: '/category/Electronics',
        items: [
          { label: 'Hard drives', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Electronics' },
          { label: 'PC accessories', image: 'https://images.unsplash.com/photo-1587202372775-a5f6d6c87453?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Electronics' },
          { label: 'Audio gear', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Electronics' },
          { label: 'Smart home', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Electronics' },
        ],
      },
      {
        title: 'Everyday beauty finds',
        ctaLabel: 'Shop beauty',
        ctaRoute: '/category/Beauty',
        items: [
          { label: 'Skincare', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Beauty' },
          { label: 'Body care', image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Beauty' },
          { label: 'Fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Beauty' },
          { label: 'Wellness', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Beauty' },
        ],
      },
      {
        title: 'Made for kids',
        ctaLabel: 'See more',
        ctaRoute: '/category/Kids%20%26%20Toys',
        items: [
          { label: 'Learning', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Kids%20%26%20Toys' },
          { label: 'Playtime', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Kids%20%26%20Toys' },
          { label: 'Outdoor fun', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Kids%20%26%20Toys' },
          { label: 'Baby care', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&h=800&fit=crop&q=85', targetUrl: '/category/Kids%20%26%20Toys' },
        ],
      },
    ],
    railTitles: {
      electronics: 'Top electronics picks',
      fashion: 'Top fashion picks',
      home: 'Popular home picks',
      beauty: 'Staff picks in beauty',
      sports: 'Top sports picks',
    },
    sections: {
      categoriesTitle: 'Shop by category',
      categoriesCta: 'See all departments',
      featuredTitle: 'Featured products',
      featuredCta: 'See all',
      electronicsTitle: 'Electronics picks',
      electronicsCta: 'See all electronics',
      homeTitle: 'Home essentials',
      homeCta: 'See all home',
      fashionTitle: 'Fashion picks',
      fashionCta: 'See all fashion',
      beautyTitle: 'Beauty & wellness',
      beautyCta: 'See all beauty',
      sportsTitle: 'Sports & fitness',
      sportsCta: 'See all sports',
      dealsTitle: "Today's deals",
      dealsCta: 'See all deals',
      recommendedTitle: 'Recommended for you',
      recommendedCta: 'Explore all products',
      panelSeeMore: 'See more',
    },
  },
  infoPages: {
    about: {
      title: 'About Robbobo',
      description: 'Robbobo is a customer-focused online store built to make everyday shopping in Ghana simpler, faster, and more reliable.',
      sections: [
        {
          heading: 'Who we are',
          items: [
            'Robbobo is an online retail store serving shoppers who want trusted products across electronics, fashion, home, beauty, and everyday essentials.',
            'Our goal is to combine broad product discovery with a cleaner shopping experience that feels easy to use on both desktop and mobile.',
            'We are building a storefront designed around straightforward browsing, clear product pages, simple checkout, and reliable support.',
          ],
        },
        {
          heading: 'What we offer',
          items: [
            'A growing catalog of products across multiple departments, including electronics, home and living, beauty, sports, and lifestyle categories.',
            'Structured navigation with category pages, submenu discovery, search, and product detail pages built to help customers find items quickly.',
            'Customer account features for sign-in, order history, checkout continuity, and order tracking support.',
          ],
        },
        {
          heading: 'How we serve customers',
          items: [
            'We aim to present products as clearly and accurately as possible, including pricing, descriptions, and important buying information.',
            'We support shoppers through contact options, tracking tools, and help pages for returns, delivery, policies, and account-related questions.',
            'We continue improving the platform over time to make product management, storefront updates, and customer shopping smoother.',
          ],
        },
        {
          heading: 'Our focus',
          items: [
            'Trust, simplicity, and consistency in the shopping experience.',
            'Better visibility for products through organized categories and storefront management tools.',
            'A practical, modern retail platform that can grow with customer needs and store operations.',
          ],
        },
      ],
    },
    shipping: {
      title: 'Shipping Information',
      description: 'Dispatch times, delivery expectations, and shipping policies for direct retail orders.',
      sections: [
        { heading: 'Dispatch', items: ['In-stock items ship first', 'Average dispatch in 48 hours', 'Peak campaigns may extend lead times'] },
        { heading: 'Delivery', items: ['Nationwide coverage', 'Tracking details after processing', 'Support for delivery issues'] },
        { heading: 'Costs', items: ['Free shipping on qualifying orders', 'Standard fees below threshold', 'Shown before order confirmation'] },
      ],
    },
    returns: {
      title: 'Returns & Refunds',
      description: 'Learn how Robbobo handles return requests, exchanges, refunds, and support for eligible orders.',
      sections: [
        {
          heading: 'Eligible returns',
          items: [
            'Items must normally be returned in unused, clean, and resalable condition unless the return is due to a defect or wrong delivery.',
            'Original packaging, tags, accessories, manuals, and bundled items should be included whenever possible.',
            'Return requests should be raised within the applicable support window communicated for the order or product category.',
          ],
        },
        {
          heading: 'Items that may be refused',
          items: [
            'Products showing misuse, damage after delivery, missing accessories, or heavy wear may not qualify for full return approval.',
            'Some hygiene-sensitive, clearance, custom, or specially sourced items may be non-returnable unless faulty or incorrectly supplied.',
            'Robbobo may request photos, videos, or additional details before approving a disputed or damaged-item return.',
          ],
        },
        {
          heading: 'How to request a return',
          items: [
            'Contact Robbobo support and provide your order number, name, phone number, and a short explanation of the issue.',
            'Where relevant, include clear photos of the item, packaging, damage, defect, or incorrect product received.',
            'Do not return products without approval instructions, as support may first provide troubleshooting, exchange, or collection guidance.',
          ],
        },
        {
          heading: 'Refunds and exchanges',
          items: [
            'Approved returns may be resolved by exchange, store credit, partial refund, or full refund depending on the issue and product condition.',
            'Refund timing can vary based on payment method, verification checks, and whether the returned item has been inspected.',
            'Delivery fees, handling charges, or collection costs may not always be refundable unless the return is caused by Robbobo error.',
          ],
        },
        {
          heading: 'Support and review',
          items: [
            'Every return case is reviewed individually to ensure a fair outcome for both the customer and the store.',
            'If a product is confirmed to be defective, incorrect, or incomplete on delivery, Robbobo will work to provide a suitable resolution as quickly as possible.',
            'For help with a current order, customers should use the contact and order-tracking tools available on the website.',
          ],
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Quick answers to common questions about shopping, payments, delivery, accounts, and support on Robbobo.',
      sections: [
        {
          heading: 'Orders and checkout',
          items: [
            'How do I place an order? Browse products, add items to cart, then continue to checkout and provide your delivery details.',
            'Can I review my order before placing it? Yes, the checkout flow allows you to confirm your items, totals, and shipping details before submission.',
            'Will I receive an order number? Yes, every successful order creates an order reference you can use for support and tracking.',
          ],
        },
        {
          heading: 'Accounts and sign-in',
          items: [
            'Do I need an account to shop? Some order flows may require sign-in so your order history and customer details can be linked properly.',
            'How do I view my previous orders? Sign in to your account and open your saved order history or account order pages.',
            'What if I cannot access my account? Use the available sign-in recovery options or contact support for account assistance.',
          ],
        },
        {
          heading: 'Products and availability',
          items: [
            'Are product prices always final? Prices can change over time, and any available discounts or changes will be reflected on the product or checkout pages.',
            'Why might a product page look different from another category? Some categories and submenu structures are managed dynamically from the admin side and may change as the storefront is updated.',
            'What if a product becomes unavailable after I place an order? Support may contact you to confirm alternatives, adjustments, or next steps.',
          ],
        },
        {
          heading: 'Delivery, returns, and support',
          items: [
            'How can I track my order? Use the track-order page or your account order history where available.',
            'Can I return a product? Eligible items may be returned according to the store return and refund policy.',
            'How do I contact Robbobo? Use the contact page or the support options provided across the storefront.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'How customer and order information is used across the storefront.',
      sections: [
        { heading: 'Data used', items: ['Account details', 'Order information', 'Shipping contact data'] },
        { heading: 'Purpose', items: ['Fulfill orders', 'Provide support', 'Enable order tracking'] },
        { heading: 'Control', items: ['Review order history', 'Contact support about data', 'Manage sign-in access'] },
      ],
    },
    terms: {
      title: 'Terms of Service',
      description: 'These terms govern your use of the Robbobo website, your account, and every order placed through the storefront.',
      sections: [
        {
          heading: 'Using Robbobo',
          items: [
            'You must provide accurate account, delivery, and contact information when using this website.',
            'You agree to use Robbobo only for lawful shopping, browsing, support, and account-management purposes.',
            'You may not misuse the website, attempt unauthorized access, interfere with checkout, or abuse store services.',
          ],
        },
        {
          heading: 'Products, pricing, and availability',
          items: [
            'Product descriptions, images, prices, and availability are updated as accurately as possible but may change without prior notice.',
            'Some product images are for presentation only, so packaging, colors, or accessories may vary slightly from the delivered item.',
            'If a pricing, listing, or availability error is discovered after checkout, Robbobo may contact you to confirm, adjust, or cancel the order.',
          ],
        },
        {
          heading: 'Orders and payment',
          items: [
            'Every order is subject to review and acceptance before final processing or dispatch.',
            'You are responsible for providing a valid delivery address, reachable phone number, and correct order details.',
            'Orders may be delayed, adjusted, or cancelled if payment, stock, address, fraud, or verification issues arise.',
          ],
        },
        {
          heading: 'Shipping, returns, and support',
          items: [
            'Delivery estimates are provided in good faith but may be affected by stock movement, courier delays, weather, or high-order periods.',
            'Returns, exchanges, and refunds are handled according to Robbobo return and support policies in effect at the time of your order.',
            'Customers should inspect delivered items promptly and report damaged, incorrect, or missing items within the support window provided.',
          ],
        },
        {
          heading: 'Accounts, content, and liability',
          items: [
            'You are responsible for maintaining the confidentiality of your account login and for activities carried out through your account.',
            'All website branding, content, product presentation, and store materials remain the property of Robbobo or the relevant rights holders.',
            'To the maximum extent allowed by law, Robbobo is not liable for indirect, incidental, or consequential losses arising from use of the site or delays outside reasonable control.',
          ],
        },
      ],
    },
    accessibility: {
      title: 'Accessibility',
      description: 'Work in progress to keep the storefront readable and usable across devices.',
      sections: [
        { heading: 'Focus areas', items: ['Readable contrast', 'Clear navigation', 'Consistent layouts'] },
        { heading: 'Updates', items: ['Component cleanup', 'Responsive improvements', 'Reduced UI inconsistency'] },
        { heading: 'Feedback', items: ['Report issues through support', 'Share device-specific blockers', 'Request help if needed'] },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'This page explains how Robbobo uses cookies, browser storage, and session data to support shopping and account features.',
      sections: [
        {
          heading: 'What we store',
          items: [
            'Cart contents may be stored in your browser so items remain available while you continue shopping.',
            'Session-related information may be used to keep you signed in and maintain secure account access during use of the website.',
            'Limited local fallback order or browsing data may be kept temporarily to support continuity when live services are unavailable.',
          ],
        },
        {
          heading: 'Why we use cookies and storage',
          items: [
            'To preserve your cart and shopping flow between pages and repeat visits.',
            'To support sign-in sessions, account continuity, and smoother use of protected customer pages.',
            'To improve storefront reliability, including temporary fallback behavior when live sync features cannot be reached.',
          ],
        },
        {
          heading: 'Your choices',
          items: [
            'You can clear cookies or local browser storage through your browser settings at any time.',
            'Clearing stored data may sign you out, remove your cart, or delete locally cached shopping information.',
            'If you use a shared device, signing out after shopping helps prevent other users from accessing your account session.',
          ],
        },
        {
          heading: 'Policy updates',
          items: [
            'Robbobo may update this policy as site features, account tools, or storage behavior change over time.',
            'The latest version published on this page should be treated as the current cookie and storage guidance for the storefront.',
          ],
        },
      ],
    },
  },
  authContent: {
    login: {
      badge: 'Sign in',
      heroTitle: 'Welcome back to Robbobo',
      heroSubtitle: 'Sign in to access your orders, saved cart, and account settings.',
      cardTitle: 'Sign in to Robbobo',
      cardSubtitle: 'Access your cart, order history, and support centre.',
      footerPrompt: 'New to Robbobo?',
      footerLinkLabel: 'Create an account',
      highlights: [
        { title: 'Safe and secure shopping', copy: 'Saved carts, tracked orders, and consistent support access.' },
        { title: 'Track your orders', copy: 'Check order status and delivery updates from your account.' },
        { title: 'Your account, your data', copy: 'No vendor complexity - just a clean personal dashboard.' },
      ],
      testAccountTitle: 'Test account note',
      testAccountLineOne: 'There is no verified built-in test account defined in this codebase.',
      testAccountLineTwo: 'Use a confirmed Supabase Auth user to sign in and place orders.',
    },
    register: {
      badge: 'Create account',
      heroTitle: 'Join Robbobo',
      heroSubtitle: 'Create a free account to place orders, track deliveries, and manage your shopping.',
      cardTitle: 'Create your account',
      cardSubtitle: 'Start shopping at Robbobo in seconds.',
      termsPrefix: "I agree to Robbobo's",
      termsLabel: 'Terms of Service',
      privacyLabel: 'Privacy Policy',
      footerPrompt: 'Already have an account?',
      footerLinkLabel: 'Sign in',
      highlights: [
        { title: 'Secure account creation', copy: 'Your data is protected and never shared with third parties.' },
        { title: 'One account, full access', copy: 'Use one account across cart, checkout, tracking, and support.' },
        { title: 'Fast checkout access', copy: 'Create your account and continue straight to shopping.' },
      ],
    },
  },
  productPageContent: {
    freeDeliveryText: 'FREE delivery on orders over GHc500. Estimated 2-5 business days.',
    whyShopTitle: 'Why shop at Robbobo',
    reasons: [
      { title: 'Secure checkout', copy: 'Protected payments and verified ordering experience.' },
      { title: 'Fast dispatch', copy: 'Orders processed quickly with tracking support.' },
      { title: 'Easy returns', copy: 'Hassle-free returns on eligible purchases within 30 days.' },
    ],
    guaranteesTitle: 'Service guarantees',
    guarantees: ['Secure payments', 'Order tracking updates', 'Support after purchase', 'Genuine products'],
  },
  trackOrderContent: {
    badge: 'Robbobo delivery',
    title: 'Track Your Order',
    subtitle: 'Follow your shipment from confirmation to doorstep delivery with live order details and courier-style progress updates.',
    noOrderTitle: 'No order found',
    noOrderDescription: 'We could not match that order number or email. Check the value and try again, or review your saved orders.',
    accountButton: 'Back to account',
    contactButton: 'Contact support',
    helpTitle: 'Need help?',
    contactSupportOrderButton: 'Contact support about this order',
    viewAllOrdersButton: 'View all orders',
    carrierNoteLabel: 'Carrier note',
    carrierNoteText: 'Your order is being handled by Robbobo Delivery',
    shipmentProgressTitle: 'Shipment progress',
    shipmentActivityTitle: 'Shipment activity',
    itemsTitle: 'Items in this order',
  },
}

const isLegacyTermsPage = (page) => {
  const headings = Array.isArray(page?.sections) ? page.sections.map((section) => section?.heading) : []
  return (
    page?.title === 'Terms of Service' &&
    page?.description === 'Terms for purchasing from and using the storefront.' &&
    headings.length === 3 &&
    headings[0] === 'Store use' &&
    headings[1] === 'Orders' &&
    headings[2] === 'General'
  )
}

const isLegacyReturnsPage = (page) => {
  const headings = Array.isArray(page?.sections) ? page.sections.map((section) => section?.heading) : []
  return (
    page?.title === 'Returns & Refunds' &&
    page?.description === 'Straightforward return handling for eligible orders.' &&
    headings.length === 3 &&
    headings[0] === 'Eligibility' &&
    headings[1] === 'How to start' &&
    headings[2] === 'Resolution'
  )
}

const isLegacyAboutPage = (page) => {
  const headings = Array.isArray(page?.sections) ? page.sections.map((section) => section?.heading) : []
  return (
    page?.title === 'About Robbobo' &&
    page?.description === 'Robbobo is a curated B2C storefront redesigned with marketplace-inspired discovery and cleaner category merchandising.' &&
    headings.length === 3 &&
    headings[0] === 'What we sell' &&
    headings[1] === 'What changed' &&
    headings[2] === 'What stayed the same'
  )
}

const isLegacyFaqPage = (page) => {
  const headings = Array.isArray(page?.sections) ? page.sections.map((section) => section?.heading) : []
  return (
    page?.title === 'Frequently Asked Questions' &&
    page?.description === 'Quick answers about orders, products, accounts, and support.' &&
    headings.length === 3 &&
    headings[0] === 'Orders' &&
    headings[1] === 'Products' &&
    headings[2] === 'Support'
  )
}

const isLegacyCookiesPage = (page) => {
  const headings = Array.isArray(page?.sections) ? page.sections.map((section) => section?.heading) : []
  return (
    page?.title === 'Cookie Policy' &&
    page?.description === 'Local storage and session handling power cart persistence and fallback order lookup.' &&
    headings.length === 3 &&
    headings[0] === 'Stored data' &&
    headings[1] === 'Purpose' &&
    headings[2] === 'Choice'
  )
}

const mergeInfoPages = (value) => {
  const incomingPages = value?.infoPages || {}
  const mergedEntries = Object.entries(defaultSiteContent.infoPages).map(([key, defaults]) => {
    const incoming = incomingPages?.[key] || {}
    if (key === 'terms' && isLegacyTermsPage(incoming)) {
      return [key, defaults]
    }
    if (key === 'returns' && isLegacyReturnsPage(incoming)) {
      return [key, defaults]
    }
    if (key === 'about' && isLegacyAboutPage(incoming)) {
      return [key, defaults]
    }
    if (key === 'faq' && isLegacyFaqPage(incoming)) {
      return [key, defaults]
    }
    if (key === 'cookies' && isLegacyCookiesPage(incoming)) {
      return [key, defaults]
    }

    return [key, {
      ...defaults,
      ...incoming,
      sections: Array.isArray(incoming?.sections) && incoming.sections.length ? incoming.sections : defaults.sections,
    }]
  })

  return Object.fromEntries(mergedEntries)
}

const mergeMobileFeatureSections = (sections) => {
  const defaults = defaultSiteContent.homeContent.mobileFeatureSections
  if (!Array.isArray(sections) || !sections.length) {
    return defaults
  }

  const seenTitles = new Set(sections.map((section) => section?.title).filter(Boolean))
  const extras = defaults.filter((section) => !seenTitles.has(section.title))
  return [...sections, ...extras]
}

const mergePanelSets = (panels) => {
  const defaults = defaultSiteContent.homeContent.panelSets
  if (!Array.isArray(panels) || !panels.length) {
    return defaults
  }

  const defaultsByTitle = new Map(defaults.map((panel) => [panel.title, panel]))
  const mergedPanels = panels.map((panel) => {
    const matchingDefault = defaultsByTitle.get(panel?.title)
    return matchingDefault ? { ...matchingDefault, ...panel } : panel
  })

  const seenTitles = new Set(mergedPanels.map((panel) => panel?.title).filter(Boolean))
  const extras = defaults.filter((panel) => !seenTitles.has(panel.title))
  return [...mergedPanels, ...extras]
}

export const normalizeSiteContent = (value) => ({
  ...defaultSiteContent,
  ...value,
  storeBrand: { ...defaultSiteContent.storeBrand, ...(value?.storeBrand || {}) },
  categories: Array.isArray(value?.categories) && value.categories.length ? value.categories : defaultSiteContent.categories,
  homeContent: {
    ...defaultSiteContent.homeContent,
    ...(value?.homeContent || {}),
    mobileMenu: { ...defaultSiteContent.homeContent.mobileMenu, ...(value?.homeContent?.mobileMenu || {}) },
    fallbackSlides: Array.isArray(value?.homeContent?.fallbackSlides) && value.homeContent.fallbackSlides.length ? value.homeContent.fallbackSlides : defaultSiteContent.homeContent.fallbackSlides,
    panelSets: mergePanelSets(value?.homeContent?.panelSets),
    mobileFeatureSections: mergeMobileFeatureSections(value?.homeContent?.mobileFeatureSections),
    railTitles: { ...defaultSiteContent.homeContent.railTitles, ...(value?.homeContent?.railTitles || {}) },
    sections: { ...defaultSiteContent.homeContent.sections, ...(value?.homeContent?.sections || {}) },
  },
  infoPages: mergeInfoPages(value),
  authContent: {
    login: { ...defaultSiteContent.authContent.login, ...(value?.authContent?.login || {}) },
    register: { ...defaultSiteContent.authContent.register, ...(value?.authContent?.register || {}) },
  },
  productPageContent: {
    ...defaultSiteContent.productPageContent,
    ...(value?.productPageContent || {}),
    reasons: Array.isArray(value?.productPageContent?.reasons) && value.productPageContent.reasons.length ? value.productPageContent.reasons : defaultSiteContent.productPageContent.reasons,
    guarantees: Array.isArray(value?.productPageContent?.guarantees) && value.productPageContent.guarantees.length ? value.productPageContent.guarantees : defaultSiteContent.productPageContent.guarantees,
  },
  trackOrderContent: { ...defaultSiteContent.trackOrderContent, ...(value?.trackOrderContent || {}) },
})
