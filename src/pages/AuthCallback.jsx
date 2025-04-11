import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { socialLogin } from '../apis/authAPI';
import useAuthStore from '../storage/useAuthStore';
import { getMyInfo } from '../apis/authAPI';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function AuthCallback() {
    const { provider } = useParams();
    const navigate = useNavigate();
    const query = useQuery();
    const { login, setUserData } = useAuthStore(); // ✅ setUserData도 구조 분해

    

    useEffect(() => {
        const handleLogin = async () => {
            const code = query.get('code');
            const state = query.get('state'); // 네이버용

            if (!provider || !code) {
                console.warn('provider 또는 code 누락');
                navigate('/login');
                return;
            }

            try {
                const { accessToken, refreshToken, newUser } = await socialLogin(provider, code, state);
                console.log('📌 isNewUser:', newUser);

                // 토큰 저장
                login(accessToken, refreshToken);

                // 회원가입 페이지로 이동할지, 홈으로 갈지 결정
                if (newUser) {
                    navigate('/signup');
                } else {
                    navigate('/');
                    console.log('로그인 성공');
                    // 로그인 성공 후 추가 작업 (예: 사용자 정보 가져오기 등)
                    const userInfo = await getMyInfo();
                    console.log('내 정보:', userInfo.data);
                    setUserData(userInfo.data); // ✅ 응답의 data만 저장
                }

            } catch (err) {
                console.error('로그인 실패', err);
                navigate('/login'); 
            }
        };

        handleLogin();
    }, [provider]);

    return;
}
