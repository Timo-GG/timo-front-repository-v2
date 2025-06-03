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
    const { login, setUserData } = useAuthStore();

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

                // 사용자 정보 가져오기
                const userInfo = await getMyInfo();
                console.log('내 정보:', userInfo);
                setUserData(userInfo.data);

                // term이 null이면 약관 동의가 필요한 사용자 -> 회원가입 페이지로 이동
                if (userInfo.data.term === null) {
                    console.log('약관 동의가 필요한 사용자입니다.');
                    navigate('/signup');
                } else {
                    console.log('로그인 성공');

                    // 저장된 리다이렉트 경로 확인
                    const redirectPath = localStorage.getItem('redirectAfterLogin');

                    if (redirectPath) {
                        console.log('리다이렉트 경로:', redirectPath);
                        localStorage.removeItem('redirectAfterLogin'); // 사용 후 제거
                        navigate(redirectPath);
                    } else {
                        navigate('/'); // 기본값: 메인페이지
                    }
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
