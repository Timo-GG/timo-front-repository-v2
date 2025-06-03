// src/components/TermsModal.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function TermsModal({ open, onClose, type }) {
    const getTitle = () => {
        return type === 'terms' ? 'Timo 서비스 이용약관' : 'Timo 서비스 개인정보 수집·이용 동의서';
    };

    const getContent = () => {
        if (type === 'terms') {
            return (
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>제1장 총칙</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제1조 (목적)</Typography>
                    <Typography variant="body2" mb={2}>
                        본 약관은 <strong>Timo(이하 "플랫폼")</strong>가 제공하는 서비스의 이용과 관련하여 플랫폼과 이용자의 권리, 의무 및 책임사항을 명확히 규정하는 것을 목적으로 합니다.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제2조 (용어의 정의)</Typography>
                    <Typography variant="body2" mb={1}>① <strong>플랫폼</strong>이란 Timo가 운영하는 웹사이트 및 앱 등 서비스 제공을 위한 가상의 공간을 말합니다.</Typography>
                    <Typography variant="body2" mb={1}>② <strong>이용자</strong>란 본 약관에 따라 플랫폼에 접속하여 서비스를 이용하는 회원 및 비회원을 의미합니다.</Typography>
                    <Typography variant="body2" mb={1}>③ <strong>회원</strong>이란 OAuth 방식(카카오, 네이버, 디스코드, 라이엇)으로 가입한 이용자를 말합니다.</Typography>
                    <Typography variant="body2" mb={1}>④ <strong>소환사 닉네임 및 태그</strong>란 회원가입 시 본인의 리그 오브 레전드(LoL) 계정을 인증하기 위해 제공하는 정보를 말합니다.</Typography>
                    <Typography variant="body2" mb={1}>⑤ <strong>닉네임</strong>이란 플랫폼 내에서 회원 식별을 위해 회원이 설정한 명칭입니다.</Typography>
                    <Typography variant="body2" mb={1}>⑥ <strong>매칭 서비스</strong>란 설정한 조건(라인, 게임 모드, 상태, 마이크 유무, 선호 듀오 포지션 및 스타일)을 기반으로 듀오 매칭을 지원하는 서비스를 말합니다.</Typography>
                    <Typography variant="body2" mb={1}>⑦ <strong>게시판 서비스</strong>란 회원 간 정보 공유 및 의견 교환을 지원하는 서비스를 말합니다.</Typography>
                    <Typography variant="body2" mb={2}>⑧ <strong>소환사 조회 서비스</strong>란 리그 오브 레전드 게임 데이터를 조회하는 서비스를 말합니다.</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제3조 (약관 명시와 개정)</Typography>
                    <Typography variant="body2" mb={1}>① 플랫폼은 약관을 쉽게 확인할 수 있도록 초기화면에 게시합니다.</Typography>
                    <Typography variant="body2" mb={1}>② 플랫폼은 약관 변경 시 최소 7일 전에 공지하며, 회원에게 불리한 변경은 30일 전에 개별 통지합니다.</Typography>
                    <Typography variant="body2" mb={2}>③ 회원은 변경된 약관에 동의하지 않을 수 있으며, 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.</Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>제2장 이용계약 및 개인정보 보호</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제4조 (회원가입)</Typography>
                    <Typography variant="body2" mb={2}>
                        회원가입은 OAuth(카카오, 네이버, 디스코드, 라이엇)를 통해 이루어지며, 소환사 닉네임 및 태그, 플랫폼 내 사용할 닉네임을 입력하고 인증 완료 시 가입이 완료됩니다.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제5조 (회원가입 제한)</Typography>
                    <Typography variant="body2" mb={1}>플랫폼은 다음의 경우 가입을 제한할 수 있습니다.</Typography>
                    <Typography variant="body2" mb={1}>- 타인의 정보를 도용한 경우</Typography>
                    <Typography variant="body2" mb={1}>- 서비스 운영상 기술적인 문제가 발생한 경우</Typography>
                    <Typography variant="body2" mb={1}>- 허위 또는 필수 정보가 누락된 경우</Typography>
                    <Typography variant="body2" mb={2}>- 기타 부적절한 가입 신청으로 판단되는 경우</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제6조 (개인정보 보호)</Typography>
                    <Typography variant="body2" mb={2}>
                        플랫폼은 최소한의 개인정보만 수집하며, 관련 법령 및 개인정보 처리방침에 따라 철저히 보호합니다.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>제3장 서비스 이용</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제7조 (서비스 제공)</Typography>
                    <Typography variant="body2" mb={2}>
                        플랫폼은 회원에게 매칭 서비스, 게시판 서비스, 소환사 조회 서비스를 제공하며, 서비스 내용 변경 또는 중단 시 사전에 공지합니다.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제8조 (이용자의 의무)</Typography>
                    <Typography variant="body2" mb={1}>이용자는 다음과 같은 행위를 해서는 안 됩니다.</Typography>
                    <Typography variant="body2" mb={1}>- 허위 정보 등록 행위</Typography>
                    <Typography variant="body2" mb={1}>- 계정 도용 및 부정 사용 행위</Typography>
                    <Typography variant="body2" mb={1}>- 플랫폼 서비스 운영 방해 행위</Typography>
                    <Typography variant="body2" mb={2}>- 기타 법령 및 약관 위배 행위</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제9조 (회원탈퇴 및 이용제한)</Typography>
                    <Typography variant="body2" mb={1}>
                        ① 회원은 언제든지 탈퇴할 수 있으며, 탈퇴일로부터 30일이 경과한 후 개인정보가 삭제됩니다. 단, 관련 법령에 따라 수사·조사 등이 진행 중일 경우 종료 시까지 보관됩니다.
                    </Typography>
                    <Typography variant="body2" mb={2}>② 약관 위반 시 서비스 이용이 제한되거나 회원 자격이 상실될 수 있습니다.</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제10조 (저작권)</Typography>
                    <Typography variant="body2" mb={2}>
                        플랫폼에 게시된 콘텐츠의 저작권은 플랫폼 또는 콘텐츠 제공자에게 귀속되며, 무단 복제 및 배포는 엄격히 금지됩니다.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제11조 (면책)</Typography>
                    <Typography variant="body2" mb={2}>
                        플랫폼은 천재지변, 회원의 귀책사유, 제3자의 공격 등 플랫폼이 통제할 수 없는 상황에서 발생한 손해에 대해서는 책임을 지지 않습니다.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제12조 (분쟁 해결)</Typography>
                    <Typography variant="body2" mb={2}>
                        분쟁이 발생할 경우 상호 협의를 통해 우선 해결하며, 합의가 어려운 경우 관련 법령에 따라 관할법원에서 처리합니다.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>제4장 이용계약 해지</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>제13조 (이용계약 해지)</Typography>
                    <Typography variant="body2" mb={2}>
                        회원이 계약을 해지하면 관련 법령에 따라 보관 의무가 있는 정보를 제외하고, 탈퇴일로부터 30일 이후 모든 데이터를 삭제합니다. 단, 다른 회원의 정상적인 서비스 이용을 위해 필요한 정보 또는 법령상 보관이 필요한 정보는 제외될 수 있습니다.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>부칙</Typography>
                    <Typography variant="body2">이 약관은 2025년 6월 3일부터 시행됩니다.</Typography>
                </Box>
            );
        } else {
            return (
                <Box>
                    <Typography variant="body2" mb={2}>
                        Timo 서비스는 회원가입 및 서비스 이용을 위하여 아래와 같이 개인정보를 수집 및 이용합니다. 내용을 숙지하신 후 동의 여부를 결정해 주시기 바랍니다.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>1. 수집하는 개인정보의 항목</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>홈페이지 회원가입 및 관리</Typography>
                    <Typography variant="body2" mb={1}>수집 정보: 이메일 주소, 닉네임, 소환사 닉네임 및 태그, OAuth 로그인 정보(카카오, 네이버, 디스코드, 라이엇 식별자)</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>민원사무 처리</Typography>
                    <Typography variant="body2" mb={1}>수집 정보: 이메일 주소</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>재화 또는 서비스 제공</Typography>
                    <Typography variant="body2" mb={1}>수집 정보: 이메일 주소, 닉네임, 소환사 닉네임 및 태그</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>인터넷 서비스 이용과정에서 자동으로 생성 및 수집되는 정보</Typography>
                    <Typography variant="body2" mb={1}>- 회원이 Meta Platform, Inc에 등록한 계정과의 연동을 위한 식별자</Typography>
                    <Typography variant="body2" mb={1}>- 회원이 Apple, Inc에 등록한 계정과의 연동을 위한 식별자</Typography>
                    <Typography variant="body2" mb={1}>- 회원이 라이엇게임즈코리아 유한회사(Riot Games Korea, Ltd.)에 등록한 계정과의 연동을 위한 식별자</Typography>
                    <Typography variant="body2" mb={2}>- 접속 IP 정보, 쿠키, 접속로그, 서비스 이용기록, 이용제한 기록 등</Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>2. 개인정보의 수집·이용 목적</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>홈페이지 회원가입 및 관리</Typography>
                    <Typography variant="body2" mb={1}>회원 가입의사 확인, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 분쟁 조정을 위한 기록 보존 등을 위해 수집·이용합니다.</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>민원사무 처리</Typography>
                    <Typography variant="body2" mb={1}>민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등을 위해 수집·이용합니다.</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>재화 또는 서비스 제공</Typography>
                    <Typography variant="body2" mb={2}>서비스 제공, 콘텐츠 제공 등을 목적으로 수집·이용합니다.</Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>3. 개인정보의 보유 및 이용기간</Typography>
                    <Typography variant="body2" mb={1}>
                        Timo 서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 각각의 개인정보 보유 및 이용 기간은 다음과 같습니다.
                    </Typography>
                    <Typography variant="body2" mb={1}>- 홈페이지 회원가입 및 관리: 홈페이지 탈퇴일로부터 30일이 경과하는 날까지 보유합니다. 단, 관계 법령 위반에 따른 수사, 조사 등이 진행 중인 경우에는 해당 수사, 조사 종료 시까지 보관합니다.</Typography>
                    <Typography variant="body2" mb={1}>- 민원사무 처리: 민원사무 처리 완료 시까지 보유하며, 민원 발생 후 소송절차가 개시된 경우 해당 소송절차가 확정적으로 종결되는 날까지 보관합니다.</Typography>
                    <Typography variant="body2" mb={2}>- 재화 또는 서비스 제공: 재화·서비스 공급 완료 시까지 보유하며, 관련 법령에서 소비자 보호 등을 위하여 필요한 경우 해당 법령에서 정한 기간의 만료일까지 보관합니다.</Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>4. 기타 사항</Typography>
                    <Typography variant="body2" mb={1}>- 개인정보 수집 및 이용에 대해서는 거부할 수 있으며, 거부 시에는 회원가입이 불가합니다.</Typography>
                    <Typography variant="body2" mb={1}>- 서비스 제공을 위해 반드시 필요한 최소한의 개인정보이므로 동의하셔야 서비스 이용이 가능합니다.</Typography>
                    <Typography variant="body2" mb={2}>- 이 외 서비스 이용과정에서 별도 동의를 통해 추가정보 수집이 있을 수 있습니다.</Typography>

                    <Typography variant="h6" fontWeight="bold" mb={2}>부칙</Typography>
                    <Typography variant="body2">이 동의서는 2025년 6월 3일부터 시행됩니다.</Typography>
                </Box>
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: '#12121A',
                    color: '#fff',
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #3c3d4e'
            }}>
                <Typography variant="h6" fontWeight="bold">
                    {getTitle()}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {getContent()}
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #3c3d4e', pt: 2 }}>
                <Button onClick={onClose} variant="contained" sx={{
                    backgroundColor: '#42E6B5',
                    color: '#000',
                    '&:hover': { backgroundColor: '#36c7a0' }
                }}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
}
