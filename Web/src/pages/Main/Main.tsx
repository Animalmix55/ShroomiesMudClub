import React from 'react';
import { Section } from 'react-scroll-section';
import Landing from './Sections/Landing';

export const MainPage = (): JSX.Element => {
    return (
        <div>
            <Section id="Landing">
                <Landing />
            </Section>
        </div>
    );
};

export default MainPage;
