import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store';
import { signInWithGoogle } from '../../store/slices/authSlice';
import { startTest } from '../../store/slices/testSlice';
import { Colors } from '../../constants/Colors';
import { ActivityIndicator, Alert } from 'react-native';
import { firestoreService, Ranker } from '../../services/FirestoreService';

const TestCard = ({ title, questions, duration, locked, onPress, index, isDark, loading }: any) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity
            style={[styles.testCard, locked && styles.lockedCard, isDark && { backgroundColor: '#1E1E1E' }]}
            onPress={onPress}
            disabled={locked}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={locked ? ['#E0E0E0', '#BDBDBD'] : Colors.gradients.ocean}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Icon name={locked ? "lock" : "history-edu"} size={24} color="#fff" />
                    </View>
                    {locked && <View style={styles.lockBadge}><Text style={styles.lockText}>PREMIUM</Text></View>}
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.testTitle}>{title}</Text>
                    <View style={styles.testMeta}>
                        <Icon name="format-list-numbered" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.metaText}>{questions} Questions</Text>
                        <Text style={styles.metaDivider}>•</Text>
                        <Icon name="timer" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.metaText}>{duration} mins</Text>
                    </View>
                </View>

                {!locked && (
                    <View style={styles.playButton}>
                        {loading ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                            <Icon name="play-arrow" size={24} color={Colors.primary} />
                        )}
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    </Animated.View>
);

const RankerCard = ({ ranker, rank, isDark }: { ranker: Ranker; rank: number; isDark: boolean }) => {
    const getRankStyles = () => {
        switch (rank) {
            case 1: return { icon: 'workspace-premium', color: '#FFD700', bg: 'rgba(255, 215, 0, 0.15)' };
            case 2: return { icon: 'emoji-events', color: '#C0C0C0', bg: 'rgba(192, 192, 192, 0.15)' };
            case 3: return { icon: 'military-tech', color: '#CD7F32', bg: 'rgba(205, 127, 50, 0.15)' };
            default: return { icon: 'person', color: '#888', bg: 'rgba(136, 136, 136, 0.1)' };
        }
    };

    const styles_rank = getRankStyles();

    return (
        <Animated.View entering={FadeInUp.delay(Math.min(rank * 100, 500))}>
            <View style={[styles.rankerCard, isDark && { backgroundColor: '#1E1E1E' }]}>
                <View style={[styles.rankIconContainer_small, { backgroundColor: styles_rank.bg }]}>
                    <Icon name={styles_rank.icon} size={20} color={styles_rank.color} />
                </View>
                <View style={styles.rankerInfo}>
                    <Text style={[styles.rankerName, isDark && { color: '#fff' }]}>{ranker.name}</Text>
                    <Text style={styles.rankerScore}>{ranker.score || 0} Points • {ranker.totalQuizzes || 0} Tests</Text>
                </View>
                <View style={styles.rankBadge_small}>
                    <Text style={[styles.rankText, { color: styles_rank.color }]}>#{rank}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const TestListScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const theme = useSelector((state: RootState) => state.user.preferences.theme);
    const [loading, setLoading] = React.useState<string | null>(null);
    const [rankersLoading, setRankersLoading] = React.useState(true);
    const [topRankers, setTopRankers] = React.useState<Ranker[]>([]);
    const isDark = theme === 'dark';
    const themeColors = isDark ? {
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#AAAAAA'
    } : {
        background: '#F5F5F7',
        card: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666'
    };

    // Mock Data for Tests
    const tests = [
        { id: 'test1', title: 'History Test 1', questions: 20, duration: 30, slug: 'test1' },
        { id: 'test2', title: 'History Test 2', questions: 20, duration: 30, slug: 'test2' },
    ];

    // Fetch top rankers when component mounts
    React.useEffect(() => {
        fetchTopRankers();
    }, []);

    const fetchTopRankers = async () => {
        try {
            setRankersLoading(true);
            const rankers = await firestoreService.fetchTopRankers(5);
            setTopRankers(rankers);
        } catch (error) {
            console.error('Error fetching rankers:', error);
            // Don't show dummy data, just leave empty
            setTopRankers([]);
        } finally {
            setRankersLoading(false);
        }
    };

    const handleSignIn = () => {
        dispatch(signInWithGoogle() as any);
    };

    const handleTestPress = async (test: any) => {
        if (!isAuthenticated) {
            Alert.alert('Sign In Required', 'Please sign in to take tests.');
            return;
        }

        setLoading(test.id);
        try {
            // Fetch test from Firestore
            const testData = await firestoreService.fetchTest(test.slug);
            
            if (!testData || testData.questions.length === 0) {
                Alert.alert(
                    'Test Not Available', 
                    'This test needs to be uploaded first. Please ask admin to upload test data.',
                    [
                        { text: 'OK' },
                        { 
                            text: 'Upload Now', 
                            onPress: () => navigation.navigate('Profile')
                        }
                    ]
                );
                return;
            }

            // Start Test using test slice
            dispatch(startTest({
                testId: testData.id,
                testTitle: testData.title,
                questions: testData.questions,
                timeLimit: testData.duration * 60,
            }));

            // Navigate to Test Screen
            navigation.navigate('Test');
        } catch (error) {
            console.error('Error loading test:', error);
            Alert.alert(
                'Error Loading Test', 
                'Failed to load test. This might be due to:\n\n1. Test not uploaded yet\n2. Network connection issues\n3. Permission settings\n\nPlease try uploading the test first.',
                [
                    { text: 'OK' },
                    { 
                        text: 'Go to Profile', 
                        onPress: () => navigation.navigate('Profile')
                    }
                ]
            );
        } finally {
            setLoading(null);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <LinearGradient
                colors={isDark ? ['#1A237E', '#0D47A1'] : Colors.gradients.royal}
                style={styles.header}
            >
                <Animated.View entering={FadeInDown.duration(1000)}>
                    <Text style={styles.title}>Premium Tests</Text>
                    <Text style={styles.subtitle}>
                        High-stakes exams for serious aspirants
                    </Text>
                </Animated.View>
            </LinearGradient>

            {!isAuthenticated ? (
                <View style={styles.lockContainer}>
                    <Animated.View entering={FadeInUp.delay(300)} style={[styles.lockContent, { backgroundColor: themeColors.card }]}>
                        <Icon name="lock" size={64} color={Colors.primary} style={styles.mainLockIcon} />
                        <Text style={[styles.lockTitle, { color: themeColors.text }]}>Premium Access Required</Text>
                        <Text style={[styles.lockDesc, { color: themeColors.textSecondary }]}>
                            Sign in with Google to access our world-class history test series and complete on the global leaderboard.
                        </Text>

                        <TouchableOpacity style={styles.googleBtn} onPress={handleSignIn}>
                            <View style={styles.googleIconBg}>
                                <Icon name="login" size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.googleBtnText}>Sign In to Unlock</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {tests.map((test, index) => (
                        <TestCard
                            key={test.id}
                            {...test}
                            locked={false}
                            index={index}
                            onPress={() => handleTestPress(test)}
                            isDark={isDark}
                            loading={loading === test.id}
                        />
                    ))}

                    {/* Top Rankers Section */}
                    <View style={styles.rankerSection}>
                        <View style={styles.sectionHeaderContainer}>
                            <Text style={[styles.sectionHeader, { color: themeColors.text, marginTop: 0 }]}>Top Rankers</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        {rankersLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={Colors.primary} />
                                <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>Loading rankers...</Text>
                            </View>
                        ) : topRankers.length === 0 ? (
                            <View style={styles.emptyRankersContainer}>
                                <Icon name="leaderboard" size={48} color={themeColors.textSecondary} />
                                <Text style={[styles.emptyRankersText, { color: themeColors.textSecondary }]}>
                                    No rankers yet. Be the first to complete a test!
                                </Text>
                            </View>
                        ) : (
                            topRankers.map((ranker, idx) => (
                                <RankerCard key={ranker.id} ranker={ranker} rank={idx + 1} isDark={isDark} />
                            ))
                        )}
                    </View>

                    {/* Coming Soon Section */}
                    <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>Coming Soon</Text>
                    <TestCard
                        id={99}
                        title="Advanced History Test"
                        questions={50}
                        duration={60}
                        locked={true}
                        index={5}
                        onPress={() => { }}
                        isDark={isDark}
                    />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 5,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#666',
        marginTop: 20,
        marginBottom: 15,
        marginLeft: 5,
    },
    testCard: {
        marginBottom: 16,
        borderRadius: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        backgroundColor: '#fff',
    },
    lockedCard: {
        opacity: 0.8,
    },
    cardGradient: {
        padding: 20,
        borderRadius: 24,
        minHeight: 140,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockBadge: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    lockText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },
    cardContent: {
        marginTop: 10,
    },
    testTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    testMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    metaDivider: {
        color: 'rgba(255,255,255,0.5)',
        marginHorizontal: 10,
    },
    playButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    lockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    lockContent: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 30,
        elevation: 10,
        width: '100%',
    },
    lockImage: {
        width: 0,
        height: 0, // Hidden for now
    },
    mainLockIcon: {
        marginBottom: 20,
        backgroundColor: '#FFF3E0',
        padding: 20,
        borderRadius: 50,
    },
    lockTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    lockDesc: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
        width: '100%',
        justifyContent: 'center',
    },
    googleIconBg: {
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 8,
        marginRight: 12,
    },
    googleBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    rankerSection: {
        marginTop: 30,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 5,
    },
    viewAllText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    rankerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    rankIconContainer_small: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    rankerInfo: {
        flex: 1,
    },
    rankerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    rankerScore: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    rankBadge_small: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    rankText: {
        fontSize: 14,
        fontWeight: '900',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    emptyRankersContainer: {
        alignItems: 'center',
        padding: 30,
    },
    emptyRankersText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default TestListScreen;
