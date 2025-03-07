import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dietaryPreferences: string[];
  allergies: string[];
  subscriptionStatus: 'free' | 'premium';
  subscriptionExpiryDate?: Date;
  createdAt: Date;
}

// Styled Components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MainPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProfileCard = styled(Card)`
  text-align: center;
`;

const AvatarContainer = styled.div`
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const Avatar = styled.div<{ imageUrl?: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : 'none')};
  background-color: ${({ imageUrl, theme }) => (imageUrl ? 'transparent' : theme.colors.primaryLight)};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const AvatarPlaceholder = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.primary};
`;

const UserName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserEmail = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SubscriptionBadge = styled.div<{ isPremium: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: white;
  text-transform: capitalize;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ isPremium, theme }) => 
    isPremium ? theme.colors.success : theme.colors.info};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: border-color ${({ theme }) => theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const AddTagContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TagInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Styled component para el Link
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-block;
  width: 100%;
`;

/**
 * Profile page component
 */
const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newDietaryPreference, setNewDietaryPreference] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  
  // Mock data fetch - in a real app, this would come from an API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockUserProfile: UserProfile = {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          dietaryPreferences: ['Vegetarian', 'Low Carb', 'High Protein'],
          allergies: ['Peanuts', 'Shellfish'],
          subscriptionStatus: 'free',
          createdAt: new Date('2023-01-15'),
        };
        
        setUserProfile(mockUserProfile);
        setName(mockUserProfile.name);
        setEmail(mockUserProfile.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated]);
  
  // Handle form submission
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated profile to an API
    console.log('Profile updated:', { name, email });
    // Show success message
    alert(t('profile.updateSuccess'));
  };
  
  // Handle password change
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (password !== confirmPassword) {
      alert(t('profile.passwordNotMatch'));
      return;
    }
    
    if (password.length < 8) {
      alert(t('profile.passwordLength'));
      return;
    }
    
    // In a real app, this would send the updated password to an API
    console.log('Password updated');
    // Show success message and clear fields
    alert(t('profile.passwordSuccess'));
    setPassword('');
    setConfirmPassword('');
  };
  
  // Add dietary preference
  const handleAddDietaryPreference = () => {
    if (!newDietaryPreference.trim() || !userProfile) return;
    
    if (!userProfile.dietaryPreferences.includes(newDietaryPreference)) {
      setUserProfile({
        ...userProfile,
        dietaryPreferences: [...userProfile.dietaryPreferences, newDietaryPreference],
      });
    }
    
    setNewDietaryPreference('');
  };
  
  // Remove dietary preference
  const handleRemoveDietaryPreference = (preference: string) => {
    if (!userProfile) return;
    
    setUserProfile({
      ...userProfile,
      dietaryPreferences: userProfile.dietaryPreferences.filter(p => p !== preference),
    });
  };
  
  // Add allergy
  const handleAddAllergy = () => {
    if (!newAllergy.trim() || !userProfile) return;
    
    if (!userProfile.allergies.includes(newAllergy)) {
      setUserProfile({
        ...userProfile,
        allergies: [...userProfile.allergies, newAllergy],
      });
    }
    
    setNewAllergy('');
  };
  
  // Remove allergy
  const handleRemoveAllergy = (allergy: string) => {
    if (!userProfile) return;
    
    setUserProfile({
      ...userProfile,
      allergies: userProfile.allergies.filter(a => a !== allergy),
    });
  };
  
  // Handle upgrade to premium
  const handleUpgradeToPremium = () => {
    // In a real app, this would navigate to a payment page or open a payment modal
    alert(t('profile.upgradeToPremium'));
  };
  
  if (authLoading || isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }
  
  if (!isAuthenticated || !userProfile) {
    return (
      <PageContainer>
        <Card elevation="medium" padding="large" borderRadius="medium">
          <h2>{t('profile.needLogin')}</h2>
          <p>{t('profile.needLoginDesc')}</p>
          <StyledLink to="/login">
            <Button 
              variant="primary"
              fullWidth
            >
              {t('nav.login')}
            </Button>
          </StyledLink>
        </Card>
      </PageContainer>
    );
  }
  
  const isPremium = userProfile.subscriptionStatus === 'premium';
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>{t('profile.title')}</Title>
      </PageHeader>
      
      <ProfileLayout>
        <SidePanel>
          <ProfileCard elevation="medium" padding="large" borderRadius="medium">
            <AvatarContainer>
              <Avatar imageUrl={userProfile.avatar}>
                {!userProfile.avatar && <AvatarPlaceholder>👤</AvatarPlaceholder>}
              </Avatar>
            </AvatarContainer>
            
            <UserName>{userProfile.name}</UserName>
            <UserEmail>{userProfile.email}</UserEmail>
            
            <SubscriptionBadge isPremium={isPremium}>
              {isPremium ? t('profile.premium') : t('profile.freePlan')}
            </SubscriptionBadge>
            
            {!isPremium && (
              <Button 
                variant="primary" 
                onClick={handleUpgradeToPremium}
                fullWidth
              >
                {t('profile.upgradeToPremium')}
              </Button>
            )}
          </ProfileCard>
          
          <Card elevation="low" padding="medium" borderRadius="medium">
            <SectionTitle>{t('profile.accountInfo')}</SectionTitle>
            <p>
              <strong>{t('profile.memberSince')}:</strong> {userProfile.createdAt.toLocaleDateString()}
            </p>
            {isPremium && userProfile.subscriptionExpiryDate && (
              <p>
                <strong>{t('profile.premiumExpires')}:</strong> {userProfile.subscriptionExpiryDate.toLocaleDateString()}
              </p>
            )}
          </Card>
        </SidePanel>
        
        <MainPanel>
          <Card elevation="low" padding="medium" borderRadius="medium">
            <SectionTitle>{t('profile.personalInfo')}</SectionTitle>
            <Form onSubmit={handleUpdateProfile}>
              <FormGroup>
                <Label htmlFor="name">{t('profile.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">{t('profile.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              
              <ButtonContainer>
                <Button type="submit" variant="primary">
                  {t('profile.updateProfile')}
                </Button>
              </ButtonContainer>
            </Form>
          </Card>
          
          <Card elevation="low" padding="medium" borderRadius="medium">
            <SectionTitle>{t('profile.password')}</SectionTitle>
            <Form onSubmit={handleUpdatePassword}>
              <FormGroup>
                <Label htmlFor="password">{t('profile.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormGroup>
              
              <ButtonContainer>
                <Button type="submit" variant="primary">
                  {t('profile.confirmPassword')}
                </Button>
              </ButtonContainer>
            </Form>
          </Card>
          
          <Card elevation="low" padding="medium" borderRadius="medium">
            <SectionTitle>{t('profile.dietaryPreferences')}</SectionTitle>
            <TagsContainer>
              {userProfile.dietaryPreferences.map((preference, index) => (
                <Tag key={index}>
                  {preference}
                  <RemoveTagButton onClick={() => handleRemoveDietaryPreference(preference)}>
                    ×
                  </RemoveTagButton>
                </Tag>
              ))}
            </TagsContainer>
            
            <AddTagContainer>
              <TagInput
                type="text"
                placeholder={t('profile.addDietaryPreference')}
                value={newDietaryPreference}
                onChange={(e) => setNewDietaryPreference(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDietaryPreference();
                  }
                }}
              />
              <Button 
                variant="outline" 
                onClick={handleAddDietaryPreference}
                size="small"
              >
                {t('profile.add')}
              </Button>
            </AddTagContainer>
          </Card>
          
          <Card elevation="low" padding="medium" borderRadius="medium">
            <SectionTitle>{t('profile.allergies')}</SectionTitle>
            <TagsContainer>
              {userProfile.allergies.map((allergy, index) => (
                <Tag key={index}>
                  {allergy}
                  <RemoveTagButton onClick={() => handleRemoveAllergy(allergy)}>
                    ×
                  </RemoveTagButton>
                </Tag>
              ))}
            </TagsContainer>
            
            <AddTagContainer>
              <TagInput
                type="text"
                placeholder={t('profile.addAllergy')}
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy();
                  }
                }}
              />
              <Button 
                variant="outline" 
                onClick={handleAddAllergy}
                size="small"
              >
                {t('profile.add')}
              </Button>
            </AddTagContainer>
          </Card>
        </MainPanel>
      </ProfileLayout>
    </PageContainer>
  );
};

export default Profile;
