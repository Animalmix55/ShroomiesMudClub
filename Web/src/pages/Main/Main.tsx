import React from 'react';
import { Section } from 'react-scroll-section';
import CheckUsOutSection from './Sections/CheckUsOut';
import FAQSection from './Sections/FAQ';
import JoinOurCommunity from './Sections/JoinOurCommunity';
import Landing from './Sections/Landing';
import MintNightShroomsSection from './Sections/MintNightShrooms';
import MintShroomiesSection from './Sections/MintShroomies';
import NightShroomSection from './Sections/NightShrooms';
import OurTeamSection from './Sections/OurTeam';
import RoadmapSection from './Sections/Roadmap';
import ShroomiesSection from './Sections/Shroomies';
import SupportedCausesSection from './Sections/SupportedCauses';
import WelcomeSection from './Sections/Welcome';

export const MainPage = (): JSX.Element => {
    return (
        <div>
            <Section meta="Home" id="Landing">
                <Landing />
            </Section>
            <Section meta="Welcome" id="Welcome">
                <WelcomeSection />
            </Section>
            <Section meta="Night Shrooms" id="NightShrooms">
                <NightShroomSection />
            </Section>
            <Section meta="Mint Night Shrooms" id="MintNightShrooms">
                <MintNightShroomsSection />
            </Section>
            <Section meta="Join Our Community" id="JoinOurCommunity">
                <JoinOurCommunity />
            </Section>
            <Section meta="Shroomies" id="Shroomies">
                <ShroomiesSection />
            </Section>
            <Section meta="Mint Shroomies" id="MintShroomies">
                <MintShroomiesSection />
            </Section>
            <Section meta="Roadmap" id="Roadmap">
                <RoadmapSection />
            </Section>
            <Section meta="Supported Causes" id="SupportedCauses">
                <SupportedCausesSection />
            </Section>
            <Section meta="Check Us Out" id="CheckUsOut">
                <CheckUsOutSection />
            </Section>
            <Section meta="Team" id="Team">
                <OurTeamSection />
            </Section>
            <Section meta="FAQ" id="FAQ">
                <FAQSection />
            </Section>
        </div>
    );
};

export default MainPage;
