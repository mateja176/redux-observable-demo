import React, { FC } from 'react';

const Hello: FC<{ name: string }> = ({ name }) => <h1>Hello {name}!</h1>;

export default Hello;
