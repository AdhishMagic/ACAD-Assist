/**
 * Decodes base64 encoded audio string to an AudioBuffer.
 * Expects raw PCM data (Int16) wrapped in base64.
 */
export async function decodeAudioData(
    base64Data: string,
    ctx: AudioContext,
    sampleRate: number = 24000
  ): Promise<AudioBuffer> {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert Uint8Array to Int16Array (PCM data)
    const dataInt16 = new Int16Array(bytes.buffer);
    
    // Create AudioBuffer
    const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    // Convert Int16 to Float32
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    
    return buffer;
  }
  
  export const playAudioBuffer = (
    ctx: AudioContext,
    buffer: AudioBuffer,
    onEnded?: () => void
  ) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    if (onEnded) {
      source.onended = onEnded;
    }
    source.start(0);
    return source;
  };