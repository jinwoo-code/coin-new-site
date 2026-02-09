import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 임포트

const colors = {
  bg: '#050505',
  bgSecondary: '#0a0a0a',
  primary: '#3b82f6', 
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.08)',
};

const GlassEffect = css`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.2);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled(motion.div)`
  ${GlassEffect}
  width: 100%;
  max-width: 800px;
  padding: 3rem;
  border-radius: 24px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${colors.textMuted};
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: ${colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${colors.border};
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${colors.border};
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${colors.border};
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${colors.textMuted};
  font-size: 0.95rem;
`;

const FileInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  cursor: pointer;
`;

const FakeFileInput = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed ${colors.border};
  border-radius: 10px;
  text-align: center;
  color: ${colors.textMuted};
  font-size: 0.9rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.1rem;
  background: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 2rem;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.textMuted};
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { color: #fff; }
`;

const ApplyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    studentId: '',
    grade: '1',
    interest: '프론트엔드',
    motivation: '',
    experience: '',
    availability: 'yes',
    additional: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let portfolioUrl = '';

      // 1. 파일 업로드 (선택사항)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // 공개 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
          .from('portfolios')
          .getPublicUrl(filePath);
        
        portfolioUrl = publicUrl;
      }

      // 2. DB 데이터 저장
      const { error: dbError } = await supabase
        .from('applications')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            dept: formData.department,
            student_id: formData.studentId,
            grade: formData.grade,
            interest: [formData.interest], // 배열 형태로 저장
            motivation: formData.motivation,
            experience: formData.experience,
            portfolio_url: portfolioUrl,
            availability: formData.availability,
            // additional은 필요시 DB 컬럼 추가 후 연결 가능
          },
        ]);

      if (dbError) {
        throw dbError;
      }

      alert('지원서가 성공적으로 제출되었습니다. 감사합니다!');
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(`제출 중 오류가 발생했습니다: ${error.message || error.error_description || '알 수 없는 에러'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <FormContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackButton onClick={() => navigate('/')}>← 메인으로 돌아가기</BackButton>
          <Title>COIN 지원하기</Title>
          <Subtitle>2026년 COIN과 함께 성장할 열정적인 분들을 기다립니다.</Subtitle>

          <form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label>이름</Label>
                <Input name="name" placeholder="홍길동" required value={formData.name} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>전화번호</Label>
                <Input name="phone" placeholder="010-0000-0000" required value={formData.phone} onChange={handleChange} />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>학과</Label>
                <Input name="department" placeholder="컴퓨터모바일융합과" required value={formData.department} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label>학번</Label>
                <Input name="studentId" placeholder="202600000" required value={formData.studentId} onChange={handleChange} />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>학년</Label>
                <Select name="grade" value={formData.grade} onChange={handleChange}>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>관심 분야</Label>
                <Select name="interest" value={formData.interest} onChange={handleChange}>
                  <option value="프론트엔드">프론트엔드</option>
                  <option value="백엔드">백엔드</option>
                  <option value="임베디드">임베디드</option>
                  <option value="인공지능">인공지능</option>
                  <option value="기획/디자인">기획/디자인</option>
                  <option value="기타">기타</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>지원 동기</Label>
              <TextArea name="motivation" placeholder="COIN 동아리에 지원하게 된 계기를 적어주세요." required value={formData.motivation} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>서비스 개발 관련 경험 (동아리, 대외활동, 프로젝트 등)</Label>
              <TextArea name="experience" placeholder="참여했던 활동이나 프로젝트 경험을 상세히 적어주세요." required value={formData.experience} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>포트폴리오 제출 (파일 선택)</Label>
              <FileInputWrapper>
                <FakeFileInput>
                  {file ? file.name : '파일을 선택하거나 여기로 드래그하세요'}
                </FakeFileInput>
                <FileInput type="file" onChange={handleFileChange} />
              </FileInputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>동아리 참석 가능 여부 (월~금 오후 6:30 ~ 9:30)</Label>
              <RadioGroup>
                <RadioLabel>
                  <input type="radio" name="availability" value="yes" checked={formData.availability === 'yes'} onChange={handleChange} /> 가능합니다
                </RadioLabel>
                <RadioLabel>
                  <input type="radio" name="availability" value="no" checked={formData.availability === 'no'} onChange={handleChange} /> 조정이 필요합니다
                </RadioLabel>
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label>추가로 하고 싶은 말</Label>
              <TextArea name="additional" placeholder="자유롭게 작성해주세요." value={formData.additional} onChange={handleChange} />
            </FormGroup>

            <SubmitButton
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
            >
              {loading ? '제출 중...' : '지원서 제출하기'}
            </SubmitButton>
          </form>
        </FormContainer>
      </Container>
    </PageWrapper>
  );
};

export default ApplyPage;