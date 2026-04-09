const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'pages/onboarding/Splash.tsx', name: 'Splash' },
  { path: 'pages/onboarding/Welcome.tsx', name: 'Welcome' },
  { path: 'pages/onboarding/Login.tsx', name: 'Login' },
  { path: 'pages/onboarding/Register.tsx', name: 'Register' },
  
  { path: 'pages/main/Home.tsx', name: 'Home' },
  { path: 'pages/main/Search.tsx', name: 'Search' },
  { path: 'pages/main/Categories.tsx', name: 'Categories' },
  
  { path: 'pages/products/ProductList.tsx', name: 'ProductList' },
  { path: 'pages/products/ProductDetails.tsx', name: 'ProductDetails' },
  { path: 'pages/products/Customization.tsx', name: 'Customization' },
  
  { path: 'pages/cart/Cart.tsx', name: 'Cart' },
  { path: 'pages/cart/Checkout.tsx', name: 'Checkout' },
  { path: 'pages/cart/Confirmation.tsx', name: 'Confirmation' },
  
  { path: 'pages/user/Profile.tsx', name: 'Profile' },
  { path: 'pages/user/OrderTracking.tsx', name: 'OrderTracking' },
];

pages.forEach(p => {
  const content = `import React from 'react';

const ${p.name}: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>${p.name}</h1>
    </div>
  );
};

export default ${p.name};
`;
  const absolutePath = path.join(__dirname, p.path);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content);
});

console.log('Pages generated!');
