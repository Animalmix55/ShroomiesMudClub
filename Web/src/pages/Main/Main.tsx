import React from 'react';
import { Section } from 'react-scroll-section';
import GivingBackSection from './Sections/GivingBack';
import JoinOurCommunity from './Sections/JoinOurCommunity';
import Landing from './Sections/Landing';
import MintNightShroomsSection from './Sections/MintNightShrooms';
import MintShroomiesSection from './Sections/MintShroomies';
import NightShroomSection from './Sections/NightShrooms';
import PinheadsSection from './Sections/Pinheads';
import RoadmapSection from './Sections/Roadmap';
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
            <Section id="MintShroomies">
                <MintShroomiesSection />
            </Section>
            <Section id="Roadmap">
                <RoadmapSection />
            </Section>
            <Section id="Pinheads">
                <PinheadsSection />
            </Section>
            <Section id="GivingBack">
                <GivingBackSection />
            </Section>
        </div>
    );
};

export default MainPage;
