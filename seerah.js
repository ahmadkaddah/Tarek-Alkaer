const storiesGrid = document.getElementById('stories-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('no-results');
const modal = document.getElementById('story-modal');
const modalTitle = document.getElementById('modal-title');
const modalTags = document.getElementById('modal-tags');
const modalStory = document.getElementById('modal-story');
const closeModal = document.querySelector('.close-modal');
const copyBtn = document.getElementById('copy-btn');
const whatsappShare = document.getElementById('whatsapp-share');
const telegramShare = document.getElementById('telegram-share');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

let stories = [];
let filteredStories = [];
let currentFilter = 'all';
let currentStory = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchStories();

    setupEventListeners();

    window.addEventListener('scroll', handleScroll);
});

async function fetchStories() {
    try {
        const response = await fetch('seerah-stories.json');
        stories = await response.json();
        filteredStories = [...stories];
        renderStories(filteredStories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        stories = getSampleStories();
        filteredStories = [...stories];
        renderStories(filteredStories);
    }
}

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');

            currentFilter = button.getAttribute('data-filter');
            applyFilters();
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    copyBtn.addEventListener('click', copyStoryText);

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === '') {
        applyFilters();
        return;
    }

    filteredStories = stories.filter(story => {
        return (
            story.title.toLowerCase().includes(searchTerm) ||
            story.summary.toLowerCase().includes(searchTerm) ||
            story.content.toLowerCase().includes(searchTerm) ||
            story.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    });

    if (currentFilter !== 'all') {
        filteredStories = filteredStories.filter(story =>
            story.tags.includes(currentFilter)
        );
    }

    renderStories(filteredStories);
}

function applyFilters() {
    if (currentFilter === 'all') {
        filteredStories = [...stories];
    } else {
        filteredStories = stories.filter(story =>
            story.tags.includes(currentFilter)
        );
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== '') {
        filteredStories = filteredStories.filter(story => {
            return (
                story.title.toLowerCase().includes(searchTerm) ||
                story.summary.toLowerCase().includes(searchTerm) ||
                story.content.toLowerCase().includes(searchTerm) ||
                story.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        });
    }

    renderStories(filteredStories);
}

function renderStories(storiesToRender) {
    storiesGrid.innerHTML = '';

    if (storiesToRender.length === 0) {
        noResults.style.display = 'block';
        storiesGrid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        storiesGrid.style.display = 'grid';

        storiesToRender.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';

            let tagsHTML = '';
            story.tags.forEach(tag => {
                tagsHTML += `<span class="story-tag">${tag}</span>`;
            });

            storyCard.innerHTML = `
                <div class="story-content">
                    <h3 class="story-title">${story.title}</h3>
                    <div class="story-tags">${tagsHTML}</div>
                    <p class="story-summary">${story.summary}</p>
                    <button class="read-more-btn" data-id="${story.id}">اقرأ المزيد</button>
                </div>
            `;

            storiesGrid.appendChild(storyCard);
        });

        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', openStoryModal);
        });
    }
}

function openStoryModal() {
    const storyId = parseInt(this.getAttribute('data-id'));
    currentStory = stories.find(story => story.id === storyId);

    if (currentStory) {
        modalTitle.textContent = currentStory.title;

        modalTags.innerHTML = '';
        currentStory.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'modal-tag';
            tagSpan.textContent = tag;
            modalTags.appendChild(tagSpan);
        });

        modalStory.innerHTML = currentStory.content
            .split('\n')
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');

        const shareText = `${currentStory.title}\n\n${currentStory.summary}\n\nمن موقع طريق الخير`;
        const encodedText = encodeURIComponent(shareText);

        whatsappShare.href = `https://wa.me/?text=${encodedText}`;
        telegramShare.href = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        modalStory.scrollTop = 0;
    }
}

function copyStoryText() {
    if (!currentStory) return;

    const textToCopy = `${currentStory.title}\n\n${currentStory.content}\n\nمن موقع طريق الخير`;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('فشل نسخ النص. الرجاء المحاولة مرة أخرى.');
        });
}

function handleScroll() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

function getSampleStories() {
    return [
        {
            id: 1,
            title: "صبر النبي ﷺ في الطائف",
            summary: "قصة صبر النبي محمد ﷺ عندما ذهب إلى الطائف يدعو أهلها للإسلام فقابلوه بالإساءة والرفض",
            content: "خرج النبي ﷺ إلى الطائف بعد وفاة عمه أبي طالب وزوجته خديجة رضي الله عنها، وكان ذلك في السنة العاشرة من البعثة. ذهب إلى الطائف يلتمس النصرة والمنعة من ثقيف، ويدعوهم إلى الإسلام.\n\nلكن أهل الطائف قابلوه بالإساءة والرفض، وأغروا به سفهاءهم وعبيدهم، فوقفوا له في طريقه يسبونه ويصيحون به، ويرمونه بالحجارة حتى أدموا قدميه الشريفتين.\n\nولما اشتد عليه الأذى، لجأ إلى بستان لعتبة وشيبة ابني ربيعة، وجلس في ظل شجرة، وهناك رفع يديه إلى السماء ودعا دعاءه المشهور: 'اللهم إليك أشكو ضعف قوتي، وقلة حيلتي، وهواني على الناس، يا أرحم الراحمين، أنت رب المستضعفين، وأنت ربي، إلى من تكلني؟ إلى بعيد يتجهمني؟ أم إلى عدو ملكته أمري؟ إن لم يكن بك علي غضب فلا أبالي، ولكن عافيتك هي أوسع لي...'\n\nثم أرسل الله إليه ملك الجبال يستأذنه في أن يطبق الأخشبين (جبلي مكة) على أهل الطائف، فقال النبي ﷺ: 'بل أرجو أن يخرج الله من أصلابهم من يعبد الله وحده لا يشرك به شيئاً'.\n\nوفي هذا الموقف العظيم تجلى صبر النبي ﷺ وحلمه ورحمته بأمته، حتى مع من آذوه وأساؤوا إليه.",
            tags: ["الصبر", "الرحمة", "الدعوة"]
        },
        {
            id: 2,
            title: "رحمة النبي ﷺ بالأطفال",
            summary: "مواقف من رحمة النبي محمد ﷺ بالأطفال وحسن تعامله معهم",
            content: "كان النبي ﷺ مثالاً للرحمة والرفق بالأطفال، وقد تجلت هذه الرحمة في مواقف كثيرة من حياته الشريفة.\n\nمن ذلك أنه كان يحمل الحسن والحسين رضي الله عنهما على ظهره وهو يصلي بالناس، فإذا سجد أطال السجود حتى ينزلا عن ظهره، وإذا قام حملهما.\n\nوكان ﷺ يقبل الأطفال ويلاعبهم، فقد روي أنه قبّل الحسن بن علي رضي الله عنهما، وعنده الأقرع بن حابس التميمي، فقال الأقرع: إن لي عشرة من الولد ما قبلت منهم أحداً. فنظر إليه رسول الله ﷺ ثم قال: 'من لا يَرحم لا يُرحم'.\n\nوكان ﷺ يسلم على الصبيان إذا مر بهم، ويمسح على رؤوسهم، ويدعو لهم بالبركة.\n\nومن رحمته ﷺ بالأطفال أنه كان يخفف الصلاة إذا سمع بكاء طفل، فقد قال: 'إني لأدخل في الصلاة وأنا أريد إطالتها، فأسمع بكاء الصبي فأتجوز في صلاتي كراهية أن أشق على أمه'.\n\nوكان ﷺ يراعي مشاعر الأطفال ويجبر خواطرهم، فقد مر على غلام يسلخ شاة، فقال له: 'تنح حتى أريك'، فأدخل يده بين الجلد واللحم، فدحس بها حتى توارت إلى الإبط، ثم مضى وصلى بالناس ولم يتوضأ.\n\nهذه المواقف وغيرها تبين لنا كيف كان النبي ﷺ قدوة في الرحمة والرفق بالأطفال، وتعليمنا أهمية العناية بهم وحسن معاملتهم.",
            tags: ["الرحمة", "الأخلاق"]
        },
        {
            id: 3,
            title: "حكمة النبي ﷺ في صلح الحديبية",
            summary: "كيف أظهر النبي ﷺ حكمته في صلح الحديبية رغم ما بدا فيه من شروط مجحفة بحق المسلمين",
            content: "في السنة السادسة للهجرة، خرج النبي ﷺ مع أصحابه قاصداً مكة لأداء العمرة، وليس للقتال، فلما وصلوا إلى الحديبية (وهي منطقة قريبة من مكة) منعتهم قريش من دخول مكة.\n\nبعد مفاوضات، تم التوصل إلى صلح بين المسلمين وقريش، وكانت شروطه تبدو في ظاهرها مجحفة بحق المسلمين، ومنها:\n\n1. أن يرجع المسلمون ذلك العام دون أداء العمرة، على أن يأتوا في العام القادم.\n2. من جاء من قريش مسلماً إلى المدينة يرده المسلمون إلى قريش، ومن جاء من المسلمين إلى قريش لا ترده قريش.\n3. وقف الحرب بين الطرفين لمدة عشر سنوات.\n\nشعر بعض الصحابة بالضيق من هذه الشروط، حتى إن عمر بن الخطاب رضي الله عنه سأل النبي ﷺ: 'ألست نبي الله حقاً؟' قال: 'بلى'. قال: 'ألسنا على الحق وعدونا على الباطل؟' قال: 'بلى'. قال: 'فلم نعطي الدنية في ديننا إذاً؟' فقال النبي ﷺ: 'إني رسول الله، ولست أعصيه، وهو ناصري'.\n\nوقد أثبتت الأيام حكمة النبي ﷺ في قبول هذا الصلح، فقد كانت نتائجه إيجابية للمسلمين:\n\n1. اعتراف قريش بالمسلمين ككيان سياسي له وجوده.\n2. تمكن المسلمون من نشر الدعوة في أمان، فدخل في الإسلام خلال فترة الهدنة أضعاف من دخلوا قبلها.\n3. تفرغ المسلمون لمواجهة اليهود في خيبر.\n4. عندما نقضت قريش العهد بعد سنتين، كان المسلمون قد ازدادوا قوة، مما مهد لفتح مكة.\n\nوهكذا كان صلح الحديبية الذي بدا في ظاهره هزيمة، فتحاً مبيناً كما وصفه الله تعالى في القرآن: {إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا}.",
            tags: ["الحكمة", "السياسة", "الصبر"]
        },
        {
            id: 4,
            title: "شجاعة النبي ﷺ في غزوة حنين",
            summary: "موقف يظهر شجاعة النبي ﷺ وثباته في غزوة حنين عندما فر المسلمون",
            content: "وقعت غزوة حنين في شوال من السنة الثامنة للهجرة، بعد فتح مكة مباشرة، حيث خرج النبي ﷺ بجيش كبير بلغ تعداده اثني عشر ألفاً لمواجهة قبيلتي هوازن وثقيف اللتين تجمعتا لقتال المسلمين.\n\nوقد أعجب بعض المسلمين بكثرتهم، حتى قال بعضهم: 'لن نُغلب اليوم من قلة'. لكن هذا الإعجاب بالكثرة لم ينفعهم، فقد كمن المشركون للمسلمين في مضيق حنين، وفاجؤوهم بوابل من السهام، مما أدى إلى فرار أكثر المسلمين.\n\nفي هذا الموقف العصيب، ثبت النبي ﷺ على بغلته البيضاء، ولم يفر كما فر الآخرون، بل كان يتقدم نحو العدو وهو يقول:\n\n'أنا النبي لا كذب، أنا ابن عبد المطلب'\n\nوكان العباس رضي الله عنه يمسك بلجام بغلة النبي ﷺ، وأبو سفيان بن الحارث يمسك بركابها، يكبحانها لئلا تسرع به نحو العدو.\n\nوأمر النبي ﷺ العباس - وكان جهوري الصوت - أن ينادي في الناس: 'يا أصحاب السمرة' (يقصد أصحاب بيعة الرضوان)، فأخذ العباس ينادي بأعلى صوته، فلما سمعوا الصوت، عادوا كأنهم الإبل إذا حنت إلى أولادها، وقالوا: يا لبيك، يا لبيك.\n\nثم أخذ النبي ﷺ حفنة من تراب ورمى بها وجوه المشركين وقال: 'شاهت الوجوه'، فانهزم المشركون، وانتصر المسلمون بفضل الله ثم بفضل ثبات النبي ﷺ وشجاعته.\n\nوقد نزل في هذه الغزوة قوله تعالى: {لَقَدْ نَصَرَكُمُ اللَّهُ فِي مَوَاطِنَ كَثِيرَةٍ وَيَوْمَ حُنَيْنٍ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنْكُمْ شَيْئًا وَضَاقَتْ عَلَيْكُمُ الْأَرْضُ بِمَا رَحُبَتْ ثُمَّ وَلَّيْتُمْ مُدْبِرِينَ * ثُمَّ أَنْزَلَ اللَّهُ سَكِينَتَهُ عَلَى رَسُولِهِ وَعَلَى الْمُؤْمِنِينَ}.",
            tags: ["الشجاعة", "الثبات"]
        },
        {
            id: 5,
            title: "عفو النبي ﷺ يوم فتح مكة",
            summary: "قصة عفو النبي ﷺ عن أهل مكة يوم الفتح رغم ما فعلوه به وبأصحابه من قبل",
            content: "في السنة الثامنة للهجرة، فتح الله على نبيه ﷺ مكة المكرمة، ودخلها النبي ﷺ منتصراً بعد أن خرج منها مهاجراً قبل ثماني سنوات، وبعد أن لاقى هو وأصحابه من أهلها صنوف الأذى والتعذيب والمحاربة.\n\nدخل النبي ﷺ مكة وهو مطأطئ الرأس تواضعاً لله، حتى إن لحيته لتكاد تمس واسطة الرحل، وهو يتلو سورة الفتح، ثم طاف بالبيت وحطم الأصنام التي كانت حوله.\n\nثم وقف على باب الكعبة وقريش تنتظر ما سيفعل بهم، وقد كانوا يتوقعون أن ينتقم منهم لما فعلوه به وبأصحابه من قبل. فقال لهم: 'يا معشر قريش، ما ترون أني فاعل بكم؟' قالوا: خيراً، أخ كريم وابن أخ كريم. فقال: 'اذهبوا فأنتم الطلقاء'.\n\nوبهذه الكلمات القليلة، عفا النبي ﷺ عن أهل مكة جميعاً، ولم ينتقم من أحد منهم، رغم قدرته على ذلك، وهذا من أعظم مواقف العفو في التاريخ.\n\nوقد كان لهذا العفو النبوي الكريم أثر كبير في نفوس أهل مكة، فدخل كثير منهم في الإسلام، وأصبحوا من خيرة المسلمين فيما بعد.\n\nوهكذا ضرب النبي ﷺ أروع الأمثلة في العفو عند المقدرة، وتجلت أخلاقه العظيمة التي وصفها الله تعالى بقوله: {وَإِنَّكَ لَعَلَى خُلُقٍ عَظِيمٍ}.",
            tags: ["الحكمة", "العفو", "الأخلاق"]
        },
        {
            id: 6,
            title: "تواضع النبي ﷺ مع أصحابه",
            summary: "مواقف تبين تواضع النبي ﷺ مع أصحابه وخدمته لنفسه",
            content: "كان النبي ﷺ مثالاً في التواضع مع أصحابه وخدمته لنفسه، رغم مكانته العظيمة كنبي ورسول وقائد للأمة.\n\nفقد كان ﷺ يخصف نعله، ويرقع ثوبه، ويحلب شاته، ويخدم نفسه، ويقم بيته، ويعلف بعيره، ويأكل مع الخادم، ويجالس المساكين، ويمشي مع الأرملة واليتيم في حاجتهما.\n\nوكان ﷺ يجلس بين أصحابه كواحد منهم، حتى إن الغريب إذا دخل المجلس لا يعرفه من بينهم حتى يسأل عنه. وقد جاء رجل إلى مجلس النبي ﷺ فارتعد من هيبته، فقال له النبي ﷺ: 'هون عليك، فإني لست بملك، إنما أنا ابن امرأة كانت تأكل القديد بمكة'.\n\nوكان ﷺ يزور الأنصار، ويسلم على صبيانهم، ويمسح رؤوسهم. وكان يجيب دعوة الحر والعبد، ويقبل الهدية ولو كانت جرعة لبن أو كراع أرنب، ويكافئ عليها.\n\nوفي غزوة الخندق، كان ﷺ ينقل التراب مع أصحابه حتى واراه الغبار. وفي السفر، كان يتناوب مع أصحابه في ركوب الدابة.\n\nوعندما كان أصحابه يقومون له إجلالاً، نهاهم عن ذلك وقال: 'لا تقوموا كما تقوم الأعاجم يعظم بعضها بعضاً'.\n\nهذه المواقف وغيرها تبين لنا كيف كان النبي ﷺ قدوة في التواضع ونبذ الكبر والتعالي، رغم عظيم منزلته عند الله وعند الناس.",
            tags: ["التواضع", "الأخلاق"]
        },
        {
            id: 7,
            title: "حكمة النبي ﷺ في حل النزاعات",
            summary: "كيف استخدم النبي ﷺ حكمته في حل النزاع حول وضع الحجر الأسود قبل البعثة",
            content: "قبل بعثة النبي ﷺ بخمس سنوات، أصاب الكعبة سيل جارف أدى إلى تصدع جدرانها، فقررت قريش إعادة بنائها. وعندما وصلوا إلى موضع الحجر الأسود، اختلفوا فيمن يضعه في مكانه، وكادت تنشب حرب بين القبائل بسبب هذا الشرف العظيم.\n\nاستمر النزاع أربعة أو خمسة أيام، حتى اقترح أحد كبار قريش أن يحكموا بينهم أول داخل من باب المسجد الحرام، فكان أول داخل هو محمد ﷺ، فلما رأوه قالوا: هذا الأمين، رضينا به حكماً.\n\nفلما أخبروه بالأمر، طلب رداءً وبسطه على الأرض، ثم وضع الحجر الأسود في وسطه، وطلب من زعماء القبائل المتنازعة أن يمسكوا بأطراف الرداء، ثم رفعوه جميعاً حتى إذا وصلوا به إلى موضعه، أخذه النبي ﷺ بيده ووضعه في مكانه.\n\nوبهذا الحل الحكيم، أرضى النبي ﷺ جميع القبائل، وأشركهم في شرف وضع الحجر الأسود، وجنب قريشاً حرباً كانت على وشك أن تقع بسبب هذا النزاع.\n\nوقد كان هذا الموقف من دلائل حكمة النبي ﷺ وحسن تصرفه في حل النزاعات، حتى قبل أن يوحى إليه، مما جعل قريشاً تلقبه بالصادق الأمين.",
            tags: ["الحكمة", "حل النزاعات"]
        }
    ];
}

function createStoriesJSON() {
    const storiesJSON = JSON.stringify(getSampleStories(), null, 2);

    console.log('Stories JSON created:', storiesJSON);

    const blob = new Blob([storiesJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seerah-stories.json';
    a.click();
    URL.revokeObjectURL(url);
}