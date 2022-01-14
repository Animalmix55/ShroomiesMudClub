import React from 'react';
import { Section } from 'react-scroll-section';
import JoinOurCommunity from './Sections/JoinOurCommunity';
import Landing from './Sections/Landing';
import MintNightShroomsSection from './Sections/MintNightShrooms';
import NightShroomSection from './Sections/NightShrooms';
import ShroomiesSection from './Sections/Shroomies';
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
            <Section id="MintNightShrooms">
                <MintNightShroomsSection />
            </Section>
            <Section id="JoinOurCommunity">
                <JoinOurCommunity />
            </Section>
            <Section id="Shroomies">
                <ShroomiesSection />
            </Section>
        </div>
    );
};

export default MainPage;
