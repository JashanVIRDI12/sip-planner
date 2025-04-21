import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleLayer = ({ zIndex, particleSize, speed, opacity, count }) => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id={`tsparticles-layer-${zIndex}`}
            init={particlesInit}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex,
                pointerEvents: 'none',
            }}
            options={{
                fullScreen: { enable: false },
                background: { color: '#020617' },
                fpsLimit: 60,
                detectRetina: true,
                interactivity: {
                    detectsOn: 'canvas',
                    events: {
                        onHover: { enable: true, mode: 'slow' },
                        resize: true,
                    },
                    modes: {
                        slow: {
                            factor: 0.4,
                            radius: 100,
                        },
                    },
                },
                particles: {
                    number: { value: count, density: { enable: true, area: 1000 } },
                    color: { value: '#0ea5e9' }, // darker cyan
                    shape: { type: 'circle' },
                    size: { value: particleSize },
                    opacity: { value: opacity },
                    move: {
                        enable: true,
                        speed,
                        direction: 'none',
                        random: true,
                        straight: false,
                        outModes: { default: 'out' },
                    },
                },
            }}
        />
    );
};

const ParticleBackground = () => {
    return (
        <>
            {/* Background layer - very faint and slow */}
            <ParticleLayer
                zIndex={0}
                particleSize={1}
                speed={0.2}
                opacity={0.05}
                count={40}
            />
            {/* Foreground layer - medium subtle animation */}
            <ParticleLayer
                zIndex={1}
                particleSize={2}
                speed={0.5}
                opacity={0.2}
                count={25}
            />
        </>
    );
};

export default ParticleBackground;

