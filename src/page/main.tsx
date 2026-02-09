import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation';

// --- Colors & Variables ---
const colors = {
  bg: '#050505',
  bgSecondary: '#0a0a0a',
  primary: '#3b82f6', 
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.15)',
};

// --- Animations ---
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- Global Styles ---
const GlobalWrapper = styled.div`
  background-color: ${colors.bg};
  color: ${colors.text};
  font-family: 'Pretendard', sans-serif;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

  /* Dot Grid Pattern Background */
  background-image: radial-gradient(${colors.border} 1.5px, transparent 1.5px);
  background-size: 40px 40px;
`;

const Container = styled.div<{ wide?: boolean }>`
  max-width: ${props => props.wide ? '1600px' : '1300px'};
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  padding: 10rem 0;
  position: relative;
`;

const SectionHeader = styled(motion.div)<{ centered?: boolean }>`
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.centered ? 'center' : 'flex-start'};
  text-align: ${props => props.centered ? 'center' : 'left'};

  h2 {
    font-size: clamp(2.5rem, 5vw, 3rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    span { color: ${colors.primary}; }
  }
  p {
    color: ${colors.textMuted};
    font-size: 1.15rem;
    max-width: 700px;
    line-height: 1.6;
  }
`;

// --- Navbar ---
const Nav = styled.nav<{ isScrolled: boolean }>`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease;
  background: ${props => props.isScrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(12px)' : 'none'};
  border-bottom: 1px solid ${props => props.isScrolled ? colors.border : 'transparent'};

  .logo { font-weight: 900; font-size: 1.6rem; letter-spacing: -0.05em; color: #fff; cursor: pointer; }
  .links { display: flex; gap: 2.5rem; margin-left: auto; }
  .link { color: ${colors.textMuted}; font-size: 1rem; cursor: pointer; &:hover { color: #fff; } }
  @media (max-width: 768px) { .links { display: none; } }
`;

// --- Hero Section ---
const HeroWrapper = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 120px 0 60px;
`;

const HeroContent = styled(motion.div)`
  width: 100%;
  z-index: 2;

  .brand {
    font-size: clamp(5rem, 18vw, 10rem);
    font-weight: 900;
    line-height: 0.8;
    letter-spacing: -0.05em;
    margin-bottom: 2rem;
    background: linear-gradient(180deg, #fff, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: #fff; margin-bottom: 1.5rem; }
  .sub { font-size: 1.2rem; color: ${colors.textMuted}; margin-bottom: 4rem; max-width: 650px; line-height: 1.7; }
`;

const PrimaryButton = styled(motion.button)`
  padding: 1.1rem 3rem;
  background: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #2563eb; transform: translateY(-2px); }
`;

// --- Stats ---
const StatsWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: ${colors.border};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  overflow: hidden;
  margin-top: 5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatBox = styled.div`
  background: ${colors.bgSecondary};
  padding: 3rem 2rem;
  text-align: center;
  .label { color: ${colors.textMuted}; font-size: 0.95rem; margin-bottom: 0.5rem; }
  .value { font-size: 2.8rem; font-weight: 900; color: #fff; }
`;

// --- Grid ---
const Grid = styled(motion.div)<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 1.5rem;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Card = styled(motion.div)`
  background: ${colors.bgSecondary};
  border: 1px solid ${colors.border};
  padding: 2.5rem; 
  border-radius: 20px;
  transition: all 0.3s ease;
  height: 100%;
  &:hover { border-color: ${colors.primary}; transform: translateY(-5px); }

  h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #fff; }
  p { color: ${colors.textMuted}; line-height: 1.6; font-size: 1rem; }
  ul { list-style: none; padding: 0; margin-top: 1.5rem; }
  li { color: ${colors.textMuted}; margin-bottom: 0.5rem; font-size: 1rem; }
  li::before { content: '• '; color: ${colors.primary}; font-weight: bold; }
`;

// --- Timeline ---
const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem 0;
`;

const TimelineTrack = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: ${colors.border};
  transform: translateX(-50%);
  @media (max-width: 768px) { left: 20px; }
`;

const TimelineItemStyled = styled(motion.div)<{ isLeft: boolean }>`
  display: flex;
  justify-content: ${props => props.isLeft ? 'flex-end' : 'flex-start'};
  padding-bottom: 3.5rem;
  width: 100%;
  position: relative;
  @media (max-width: 768px) { justify-content: flex-start; padding-left: 50px; }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  top: 32px;
  width: 14px;
  height: 14px;
  background: ${colors.bg};
  border: 3px solid ${colors.primary};
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  @media (max-width: 768px) { left: 20px; }
`;

const TimelineContent = styled.div`
  width: 48.5%;
  background: ${colors.bgSecondary};
  border: 1px solid ${colors.border};
  padding: 2.5rem 3.5rem;
  border-radius: 20px;
  position: relative;
  transition: all 0.3s;
  &:hover { border-color: ${colors.primary}; transform: translateY(-3px); }
  .year { font-size: 2rem; font-weight: 800; color: ${colors.primary}; margin-bottom: 1.2rem; }
  .item-list { display: flex; flex-direction: column; gap: 0.8rem; }
  .item { color: ${colors.textMuted}; font-size: 1.1rem; line-height: 1.5; display: flex; gap: 0.6rem; align-items: flex-start; word-break: keep-all; }
  .item::before { content: '•'; color: ${colors.primary}; font-weight: bold; margin-top: 2px; }
  @media (max-width: 768px) { width: 100%; }
`;

// --- Map Component (Commented out until API is ready) ---
/*
const MapContainer = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 24px;
  margin-top: 4rem;
  border: 1px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;
*/

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Nav isScrolled={isScrolled}>
      <Container style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <div className="logo" onClick={() => scrollToSection('hero')}>COIN</div>
        <div className="links">
          <span className="link" onClick={() => scrollToSection('about')}>About</span>
          <span className="link" onClick={() => scrollToSection('recruitment')}>Recruitment</span>
          <span className="link" onClick={() => scrollToSection('history')}>History</span>
          <span className="link" onClick={() => scrollToSection('contact')}>Contact</span>
        </div>
      </Container>
    </Nav>
  );
};

const Hero = () => {
  const [awardsRef, awardsCount] = useCountUp(26);
  const [patentsRef, patentsCount] = useCountUp(4);
  const [yearsRef, yearsCount] = useCountUp(14);

  return (
    <HeroWrapper id="hero">
      <Container>
        <HeroContent initial="hidden" animate="visible" variants={fadeIn}>
          <div className="brand">COIN</div>
          <h1>2026 RECRUITING</h1>
          <p className="sub">2026 COIN 동아리 신입 부원 모집. 경기과학기술대학교 최고의 프로그래밍 동아리에서 당신의 상상을 현실로 만드세요.</p>
          <PrimaryButton onClick={() => scrollToSection('recruitment')}>지금 지원하기</PrimaryButton>

          <StatsWrapper variants={staggerContainer} initial="hidden" animate="visible">
            <StatBox>
              <div className="label">설립 기간</div>
              <div className="value" ref={yearsRef as any}>{yearsCount}년</div>
            </StatBox>
            <StatBox>
              <div className="label">총 수상 횟수</div>
              <div className="value" ref={awardsRef as any}>{awardsCount}회</div>
            </StatBox>
            <StatBox>
              <div className="label">특허 출원</div>
              <div className="value" ref={patentsRef as any}>{patentsCount}회</div>
            </StatBox>
          </StatsWrapper>
        </HeroContent>
      </Container>
    </HeroWrapper>
  );
};

const About = () => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  return (
    <Section id="about" ref={ref}>
      <Container>
        <SectionHeader initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeIn}>
          <h2>Coin는 무엇을 <span>하나요?</span></h2>
          <p>단순한 코딩을 넘어, 실제 가치를 만들어내는 경험을 지향합니다.</p>
        </SectionHeader>
        <Grid initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={staggerContainer}>
          <Card variants={fadeIn}>
            <h3>스터디 & 세미나</h3>
            <p>매주 정기적인 스터디를 통해 최신 기술 트렌드를 학습하고, 서로의 지식을 공유합니다. 블록체인 기초부터 AI 심화 과정까지!</p>
          </Card>
          <Card variants={fadeIn}>
            <h3>프로젝트 진행</h3>
            <p>함께 아이디어를 구상하고 실제 서비스를 개발하는 프로젝트에 참여합니다. 당신의 아이디어를 Coin에서 현실로 만들어 보세요!</p>
          </Card>
          <Card variants={fadeIn}>
            <h3>네트워킹 & 교류</h3>
            <p>멘토링, 해커톤 참가, 동아리 간 교류 등을 통해 넓은 시야를 갖고 다양한 사람들과 소통합니다.</p>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
};

const Recruitment = () => {
  const navigate = useNavigate();
  const [ref, isVisible] = useScrollAnimation(0.2);
  return (
    <Section id="recruitment" ref={ref}>
      <Container>
        <SectionHeader initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeIn}>
          <h2>Recruiting.</h2>
          <p>열정 가득한 당신의 합류를 기다립니다.</p>
        </SectionHeader>
        
        <Grid columns={4} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={staggerContainer}>
          <Card variants={fadeIn}>
            <h3 style={{ color: colors.primary, fontSize: '1.2rem' }}>모집분야</h3>
            <ul><li>개발자</li><li>웹 디자이너</li><li>AI 엔지니어</li></ul>
          </Card>
          <Card variants={fadeIn}>
            <h3 style={{ color: colors.primary, fontSize: '1.2rem' }}>지원자격</h3>
            <ul><li>경기과학기술대학교 재학생</li><li>학과 무관 / 열정 있는 누구나</li><li>매일 동아리 참여 가능자</li></ul>
          </Card>
          <Card variants={fadeIn}>
            <h3 style={{ color: colors.primary, fontSize: '1.2rem' }}>활동내역</h3>
            <ul><li>각 종 대외 활동 및 공모전</li><li>팀 개발 프로젝트</li><li>코딩 멘토링</li></ul>
          </Card>
          <Card variants={fadeIn}>
            <h3 style={{ color: colors.primary, fontSize: '1.2rem' }}>모집기간</h3>
            <ul><li>신청기한: 0월 0일 ~ 0월 0일</li><li>면접일자: 0월 0일 ~ 0월 0일</li></ul>
          </Card>
        </Grid>

        <div style={{ marginTop: '8rem', padding: '5rem 2.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '32px', border: `1px solid ${colors.border}` }}>
          <h3 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.2rem', fontWeight: 800 }}>Selection Process</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', position: 'relative' }}>
            {[
              { n: '1', t: '지원서 제출', s: '1차 서류 지원' },
              { n: '2', t: '임원 면접', s: '2차 오프라인 면접' },
              { n: '3', t: '최종 합격', s: 'Coin의 새로운 부원' }
            ].map(step => (
              <div key={step.n} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '80px', height: '80px', background: colors.bg, border: `3px solid ${colors.primary}`, color: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', margin: '0 auto 2rem', fontSize: '2rem', fontWeight: 900, justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>{step.n}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.8rem' }}>{step.t}</div>
                <div style={{ color: colors.textMuted, fontSize: '1.1rem' }}>{step.s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '8rem' }}>
          <PrimaryButton onClick={() => navigate('/apply')}>지원서 작성하러 가기</PrimaryButton>
        </div>
      </Container>
    </Section>
  );
};

const History = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const data = [
    { year: "2025년", items: ["제15회 G-창업리그 최우수상(PetDoc)-펫닥", "제15회 G-창업리그 우수상(Arcana)-아르카나", "제15회 G-창업리그 우수상(ALENTO)-알렌토"] },
    { year: "2024년", items: ["제14회 G-창업리그 대상(Qood.)-큐드.", "제14회 G-창업리그 장려상(FitNow)-핏나우", "전공 그룹스터디 대상/금상"] },
    { year: "2023년", items: ["ICC 연계 창업캠프 창의상", "제13회 G-창업리그 최우수상(팜팜)", "제13회 G-창업리그 우수상(MWM)", "제13회 G-창업리그 장려상(캠퍼니)", "전공 그룹스터디 은상/동상"] },
    { year: "2022년", items: ["제 12회 G-창업리그 대상(짤랑)"] },
    { year: "2021년", items: ["교육부, 과기부 주최 2021 학생 창업 유망팀 300 최종선발팀"] },
    { year: "2018년", items: ["특허 출원 (소셜다이닝 서비스 제공 시스템 및 방법)", "K-Hackathon 전국 대학생 앱 챌린지 최우수상"] },
    { year: "2017년", items: ["제 7회 G-창업리그 대상(네팡이)", "K-Hackathon 지역 예선 통과 / 수도권 본선 진출"] },
    { year: "2016년", items: ["제6회 G-창업리그 금상/은상", "특허 출원 (NFC 도어락 제어 시스템)", "특허 출원 (비콘 이용 출석 확인 방법)"] },
    { year: "2015년", items: ["제5회 G-창업리그 대상", "특허 출원 (NFC 태그 보안개폐 시스템)"] },
    { year: "2014년", items: ["제1회 대학연합 창업아이디어 경진대회 대상/동상", "제4회 G-창업프로젝트 지원사업 선정"] },
  ];

  return (
    <Section id="history" ref={ref}>
      <Container wide> 
        <SectionHeader initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeIn}>
          <h2>Coin의 <span>연혁</span></h2>
          <p>우리가 걸어온 길입니다.</p>
        </SectionHeader>
        <TimelineContainer>
          <TimelineTrack />
          {data.map((d, i) => (
            <TimelineItemStyled 
              key={i} 
              isLeft={i % 2 === 0}
              initial="hidden" 
              animate={isVisible ? 'visible' : 'hidden'} 
              variants={fadeIn}
              transition={{ delay: i * 0.1 }}
            >
              <TimelineDot />
              <TimelineContent>
                <div className="year">{d.year}</div>
                <div className="item-list">
                  {d.items.map((item, idx) => (
                    <div className="item" key={idx}>{item}</div>
                  ))}
                </div>
              </TimelineContent>
            </TimelineItemStyled>
          ))}
        </TimelineContainer>
      </Container>
    </Section>
  );
};

const Contact = () => {
  const navigate = useNavigate();
  const [ref, isVisible] = useScrollAnimation(0.2);

  /*
  useEffect(() => {
    const { kakao } = window as any;
    if (!kakao || !kakao.maps) return;

    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.3402, 126.7335),
      level: 3
    };

    const map = new kakao.maps.Map(container, options);
    const markerPosition = new kakao.maps.LatLng(37.3402, 126.7335);
    const marker = new kakao.maps.Marker({ position: markerPosition });
    marker.setMap(map);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }, []);
  */

  return (
    <Section id="contact" ref={ref}>
      <Container style={{ textAlign: 'center', alignItems: 'center' }}>
        <SectionHeader centered initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeIn}>
          <h2>Where we <span>at.</span></h2>
          <p>
            경기과학기술대학교 2캠퍼스 제1중소기업관 (H동) 314호<br/>
            (경기도 시흥시 경기과기대로 270)
          </p>
        </SectionHeader>

        {/* <motion.div initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeIn} style={{ width: '100%', maxWidth: '1000px' }}>
          <MapContainer id="map" />
        </motion.div> */}
        
        <motion.div initial="hidden" animate={isVisible ? 'visible' : 'hidden'} variants={fadeIn} style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 800 }}>'Coin'과 함께하고 싶나요?</h3>
          <p style={{ color: colors.textMuted, maxWidth: '750px', margin: '0 auto 4rem', lineHeight: 1.6, fontSize: '1.15rem' }}>'Coin'은 열정 가득한 당신의 합류를 기다립니다. 기술에 대한 관심과 배우고자 하는 의지만 있다면 누구든 환영합니다!</p>
          <PrimaryButton onClick={() => navigate('/apply')}>지금 가입하기</PrimaryButton>
        </motion.div>

        <div style={{ marginTop: '8rem', color: '#333', fontSize: '0.85rem' }}>
          <p style={{ color: '#555', fontWeight: 700, marginBottom: '0.5rem' }}>경기과학기술대학교 창업동아리 COIN</p>
          <p>© 2025 Coin. All rights reserved. | coin@gtec.ac.kr</p>
        </div>
      </Container>
    </Section>
  );
};

// --- Main Wrapper ---
function Main() {
  return (
    <GlobalWrapper>
      <Navbar />
      <Hero />
      <About />
      <Recruitment />
      <History />
      <Contact />
    </GlobalWrapper>
  );
}

export default Main;