import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store';
import { signInWithGoogle } from '../../store/slices/authSlice';
import { Colors } from '../../constants/Colors';

const TestCard = ({ id, title, questions, duration, locked, onPress, index }: any) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity
            style={[styles.testCard, locked && styles.lockedCard]}
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
                        <Icon name="play-arrow" size={24} color={Colors.primary} />
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    </Animated.View>
);

const TestListScreen = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Mock Data for Tests
    const tests = [
        { id: 1, title: 'Modern History Grand Test', questions: 50, duration: 60 },
        { id: 2, title: 'Ancient Civilizations', questions: 50, duration: 60 },
        { id: 3, title: 'Medieval Dynasties', questions: 50, duration: 60 },
        { id: 4, title: 'Freedom Struggle', questions: 100, duration: 120 },
    ];

    const handleSignIn = () => {
        dispatch(signInWithGoogle() as any);
    };

    const handleTestPress = (id: number) => {
        // TODO: Navigate to active test screen
        console.log('Start Test', id);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={Colors.gradients.royal}
                style={styles.header}
            >
                <Animated.View entering={FadeInDown.duration(1000)}>
                    <Text style={styles.title}>Premium Tests</Text>
                    <Text style={styles.subtitle}>High-stakes exams for serious aspirants</Text>
                </Animated.View>
            </LinearGradient>

            {!isAuthenticated ? (
                <View style={styles.lockContainer}>
                    <Animated.View entering={FadeInUp.delay(300)} style={styles.lockContent}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png' }} // Placeholder or local asset
                            style={styles.lockImage}
                        />
                        <Icon name="lock" size={64} color={Colors.primary} style={styles.mainLockIcon} />
                        <Text style={styles.lockTitle}>Premium Access Required</Text>
                        <Text style={styles.lockDesc}>
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
                            onPress={() => handleTestPress(test.id)}
                        />
                    ))}
                    {/* Coming Soon Section */}
                    <Text style={styles.sectionHeader}>Coming Soon</Text>
                    <TestCard
                        id={99}
                        title="World Wars Mega Quiz"
                        questions={100}
                        duration={120}
                        locked={true}
                        index={5}
                        onPress={() => { }}
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
});

export default TestListScreen;
