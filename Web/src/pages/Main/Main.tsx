import React from 'react';
import { Section } from 'react-scroll-section';
import Landing from './Sections/Landing';
import NightShroomSection from './Sections/NightShrooms';
import WelcomeSection from './Sections/Welcome';

export const MainPage = (): JSX.Element => {
    return (
        <div>
            <Section id="Landing">
                <Landing />
            </Section>
            <Section id="Welcome">
                <WelcomeSection />
            </Section>
            <Section id="NightShrooms">
                <NightShroomSection />
            </Section>
        </div>
    );
};

export default MainPage;
