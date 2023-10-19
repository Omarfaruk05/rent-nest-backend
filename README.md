## This is a [RentNest](https://property-beta-three.vercel.app) backend site. This site is usually used for rental service like house rent, car rent, office rent etc. There thas four role: super_admin, admin, house_renter, house_owner. House owner can sell or tolet his houes on the other hand HOUSE RENTER can rent or buy house. HOUSE RENTER also can make house visit schedule, save house, house booking etc. Lastly admin and super_admin can action against any user. But the difference is between admin cannot see or create action against another admin.

# live link: [https://rent-nest.vercel.app]

## Authorization

### For super_admin:

email: omarfaruk@gmail.com
password:123456

## USER

- Route: [https://rent-nest.vercel.app/api/v1/users/create-user] (POST) Create users
- Route: [https://rent-nest.vercel.app/api/v1/users] (GET) Only Admins can get all users
- Route: [https://rent-nest.vercel.app/api/v1/users/user] (Single GET) Only Admins can get single user
- Route: [https://rent-nest.vercel.app/api/v1/users/update-profule] (PATCH)Only Admins can get update single user
- Route: [https://rent-nest.vercel.app/api/v1/users/:id] (DELETE)Only Admins can delete a user
- Route: [https://rent-nest.vercel.app/api/v1/users/:id] (patch)make admin

## REVIEW

- Route: [https://rent-nest.vercel.app/api/v1/reviews] (POST) Only Admin can create review
- Route: [https://rent-nest.vercel.app/api/v1/reviews] (GET) Everyone can see all reveiws
- Route: [https://rent-nest.vercel.app/api/v1/reviews/:id] (Single GET)Everyone can see a Single review
- Route: [https://rent-nest.vercel.app/api/v1/reviews/:id] (PATCH) Only Admins can update single review
- Route: [https://rent-nest.vercel.app/api/v1/reviews/:id] (DELETE) Only Admins can delete single review

## HOUSE VISIT

- Route: [https://rent-nest.vercel.app/api/v1/house-visits] (POST)Admin can create a house visit
- Route: [https://rent-nest.vercel.app/api/v1/house-visits?size=2&page=&sortBy=price&sortOrder=desc] (GET) Everyone can see all house-visits
- Route: [https://rent-nest.vercel.app/api/v1/house-visits/slots] (GET)get all available slot for house visit
- Route: [https://rent-nest.vercel.app/api/v1/house-visits/:id] (DELETE)Delete house visit

## HOUSE

- Route: [https://rent-nest.vercel.app/api/v1/houses] (POST)Admin can create a house
- Route: [https://rent-nest.vercel.app/api/v1/houses?size=2&page=&sortBy=price&sortOrder=desc] (GET) Everyone can see all houses
- Route: [https://rent-nest.vercel.app/api/v1/houses/:id] (GET single)get all available slot for house
- Route: [https://rent-nest.vercel.app/api/v1/houses/:id] (PATCH single)get all available slot for house
- Route: [https://rent-nest.vercel.app/api/v1/houses/:id] (DELETE)Delete house

## FEEDBACK

- Route: [https://rent-nest.vercel.app/api/v1/feedbacks] (POST)Admin can create a feedback
- Route: [https://rent-nest.vercel.app/api/v1/feedbacks?size=2&page=&sortBy=price&sortOrder=desc] (GET) Everyone can see all feedbacks
- Route: [https://rent-nest.vercel.app/api/v1/feedbacks/:id] (GET single)get all available slot for feedback
- Route: [https://rent-nest.vercel.app/api/v1/feedbacks/:id] (PATCH single)get all available slot for feedback
- Route: [https://rent-nest.vercel.app/api/v1/feedbacks/:id] (DELETE)Delete feedback

## FAQ

- Route: [https://rent-nest.vercel.app/api/v1/faqs] (POST)Admin can create a faq
- Route: [https://rent-nest.vercel.app/api/v1/faqs?size=2&page=&sortBy=price&sortOrder=desc] (GET) Everyone can see all faqs
- Route: [https://rent-nest.vercel.app/api/v1/faqs/:id] (GET single)get all available slot for faq
- Route: [https://rent-nest.vercel.app/api/v1/faqs/:id] (PATCH single)get all available slot for faq
- Route: [https://rent-nest.vercel.app/api/v1/faqs/:id] (DELETE)Delete faq

## BOOKING

- Route: [https://rent-nest.vercel.app/api/v1/bookings] (POST)Admin can create a booking
- Route: [https://rent-nest.vercel.app/api/v1/bookings?size=2&page=&sortBy=price&sortOrder=desc] (GET) Everyone can see all bookings
- Route: [https://rent-nest.vercel.app/api/v1/bookings/:id] (GET single)get all available slot for booking
- Route: [https://rent-nest.vercel.app/api/v1/bookings/:id] (PATCH single)get all available slot for booking
- Route: [https://rent-nest.vercel.app/api/v1/bookings/:id] (DELETE)Delete booking

## BLOG

- Route: [https://rent-nest.vercel.app/api/v1/blogs] (POST)Admin can create a blog
- Route: [https://rent-nest.vercel.app/api/v1/blogs?size=2&page=&sortBy=price&sortOrder=desc] (GET) Everyone can see all blogs
- Route: [https://rent-nest.vercel.app/api/v1/blogs/:id] (GET single)get all available slot for blog
- Route: [https://rent-nest.vercel.app/api/v1/blogs/:id] (PATCH single)get all available slot for blog
- Route: [https://rent-nest.vercel.app/api/v1/blogs/:id] (DELETE)Delete blog

## AUTH

- Route: [https://rent-nest.vercel.app/api/v1/auth/login] (POST)For login
- Route: [https://rent-nest.vercel.app/api/v1/auth/refresh-token] (GET) refresh token
