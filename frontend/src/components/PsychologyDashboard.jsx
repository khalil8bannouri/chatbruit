import React from 'react';
import { colors } from '../styles/col';

const PsychologyDashboard = ({ metrics }) => {
    return (
        <div style={styles.container}>
            <h3 style={styles.title}>🧠 État Psychologique</h3>

            <div style={styles.metrics}>
                <div style={styles.metric}>
                    <div style={styles.metricHeader}>
                        <span style={styles.metricIcon}>🎯</span>
                        <span style={styles.metricLabel}>Engagement</span>
                    </div>
                    <div style={styles.progressBar}>
                        <div style={{
                            ...styles.progressFill,
                            width: `${(metrics?.engagement || 0.5) * 100}%`,
                            backgroundColor: colors.primary[500]
                        }} />
                    </div>
                    <span style={styles.metricValue}>{Math.round((metrics?.engagement || 0.5) * 100)}%</span>
                </div>

                <div style={styles.metric}>
                    <div style={styles.metricHeader}>
                        <span style={styles.metricIcon}>💭</span>
                        <span style={styles.metricLabel}>Curiosité</span>
                    </div>
                    <div style={styles.progressBar}>
                        <div style={{
                            ...styles.progressFill,
                            width: `${(metrics?.curiosity || 0.5) * 100}%`,
                            backgroundColor: colors.secondary[500]
                        }} />
                    </div>
                    <span style={styles.metricValue}>{Math.round((metrics?.curiosity || 0.5) * 100)}%</span>
                </div>
            </div>

            <div style={styles.stats}>
                <div style={styles.stat}>
                    <div style={styles.statIcon}>💬</div>
                    <div style={styles.statContent}>
                        <div style={styles.statValue}>{metrics?.interactionCount || 0}</div>
                        <div style={styles.statLabel}>Messages</div>
                    </div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statIcon}>⏱️</div>
                    <div style={styles.statContent}>
                        <div style={styles.statValue}>{Math.floor((metrics?.sessionDuration || 0) / 60)}m</div>
                        <div style={styles.statLabel}>Durée</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '25px',
        padding: '25px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        marginBottom: '25px',
    },
    title: {
        color: colors.neutral[800],
        marginBottom: '25px',
        fontSize: '18px',
        fontWeight: '600',
        textAlign: 'center',
    },
    metrics: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '25px',
    },
    metric: {
        backgroundColor: colors.neutral[50],
        borderRadius: '15px',
        padding: '20px',
    },
    metricHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
    },
    metricIcon: {
        fontSize: '20px',
    },
    metricLabel: {
        fontSize: '14px',
        color: colors.neutral[700],
        fontWeight: '500',
    },
    progressBar: {
        height: '8px',
        backgroundColor: colors.neutral[200],
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    progressFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.5s ease',
    },
    metricValue: {
        fontSize: '20px',
        fontWeight: '600',
        color: colors.neutral[900],
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: colors.primary[50],
        padding: '15px',
        borderRadius: '12px',
    },
    statIcon: {
        fontSize: '24px',
    },
    statContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    statValue: {
        fontSize: '18px',
        fontWeight: '600',
        color: colors.neutral[900],
    },
    statLabel: {
        fontSize: '12px',
        color: colors.neutral[600],
    },
};

export default PsychologyDashboard;