const Profile = require('../models/Profile');
const Project = require('../models/Project');

function calculateYearsOfExperience(experience) {
  const currentYear = new Date().getFullYear();
  let minYear = Infinity;
  let maxYear = -Infinity;

  for (const exp of experience) {
    const period = exp.period.replace('–', '-');
    const match = period.match(/(\d{4})(?:\s*-\s*(\d{4}|Present))?/i);
    if (!match) continue;

    const startYear = parseInt(match[1]);
    const endStr = match[2];

    let endYear;
    if (!endStr || endStr.toLowerCase() === 'present') {
      endYear = currentYear;
    } else {
      endYear = parseInt(endStr);
    }

    minYear = Math.min(minYear, startYear);
    maxYear = Math.max(maxYear, endYear);
  }

  if (minYear === Infinity) return 0;
  return maxYear - minYear + 1;
}

exports.getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    const [projectCount] = await Promise.all([
      Project.countDocuments(),
    ]);

    const profileData = profile.toObject();
    profileData.stats = {
      experienceYears: calculateYearsOfExperience(profile.experience || []),
      projectCount,
    };

    res.json(profileData);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    const [projectCount] = await Promise.all([
      Project.countDocuments(),
    ]);

    const profileData = profile.toObject();
    profileData.stats = {
      experienceYears: calculateYearsOfExperience(profile.experience || []),
      projectCount,
    };

    res.json(profileData);
  } catch (err) {
    next(err);
  }
};
