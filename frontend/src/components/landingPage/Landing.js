import React from 'react';

import Headline from './Headline';
import Features from './Features';
import Rectangle from './Rectangle';

const landing = (props) => {
  return (
    <main className="w-full h-full md:h-screen">
      <Headline />
      <Rectangle />
      <Features />
    </main>
  );
};

export default landing;
