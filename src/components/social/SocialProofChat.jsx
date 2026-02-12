import React from 'react';

const SocialProofChat = ({ messages }) => {
    if (!messages) return null;

    return (
        <div className="w-full max-w-md mx-auto space-y-4 my-8 px-2 font-sans">
            <h3 className="text-center font-display font-bold text-gray-800 text-lg mb-6 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-green-500">verified</span>
                Lo que dicen en los grupos
            </h3>

            {messages.map((msg, index) => (
                <React.Fragment key={index}>
                    {msg.platform === 'whatsapp' ? (
                        <div className={`bg-[#1F2C34] p-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%] relative group animate-slideUp delay-[${index * 100}ms]`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold text-sm ${index % 2 === 0 ? 'text-[#E5554E]' : 'text-[#F3B366]'}`}>
                                    {msg.user} {msg.location ? `- ${msg.location}` : ''}
                                </span>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>

                            {msg.hasVoiceNote && (
                                <div className="flex items-center gap-3 bg-[#2A3942] rounded-full p-2 pr-4 mb-1">
                                    <button className="w-8 h-8 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                    </button>
                                    <div className="flex-1 flex flex-col justify-center gap-1">
                                        <div className="h-1 bg-gray-600 rounded-full w-full overflow-hidden">
                                            <div className="h-full w-[40%] bg-brand-blue"></div>
                                        </div>
                                        <span className="text-[10px] text-gray-400">0:12</span>
                                    </div>
                                    <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                                    <img src={`https://ui-avatars.com/api/?name=${msg.user}&background=random`} alt="User" className="w-8 h-8 rounded-full" />
                                </div>
                            )}

                            <p className="text-white text-sm leading-relaxed">
                                {msg.text}
                            </p>
                            <div className="flex justify-end mt-1">
                                <span className="material-symbols-outlined text-[#53BDEB] text-[16px]">done_all</span>
                            </div>
                            <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[10px] border-t-[#1F2C34] border-l-[10px] border-l-transparent"></div>
                        </div>
                    ) : (
                        <div className={`bg-white border border-gray-100 p-3 rounded-2xl shadow-sm max-w-[90%] ml-auto relative animate-slideUp delay-[${index * 100}ms]`}>
                            <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-2">
                                <div className="w-6 h-6 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full p-[1px]">
                                    <div className="w-full h-full bg-white rounded-full p-[1px]">
                                        <img src={`https://ui-avatars.com/api/?name=${msg.user.replace('@', '')}&background=random`} alt="User" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-800">{msg.user}</span>
                            </div>
                            <p className="text-gray-700 text-sm">
                                {msg.text}
                            </p>
                            <div className="absolute bottom-[-5px] right-4 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default SocialProofChat;
